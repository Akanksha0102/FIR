import threading
import traceback

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as http_status

from .models import UserUploadedFile, Result
from modules.ocr_module.ocr import get_ocr_instance
from modules.gpt_module.gpt import generate_fir


# ---------------- UPLOAD VIEW ----------------
class FileUploadView(APIView):
    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        obj = UserUploadedFile.objects.create(file=file)

        return Response({
            "message": "File uploaded successfully",
            "id": obj.id
        }, status=201)


def _process_fir(file_id: int, result_id: int):
    """
    Runs OCR + GPT in a background thread.
    Updates the Result row with the outcome so the frontend
    can poll for it instead of holding a single long request open
    (which exceeds Render's proxy timeout).
    """
    try:
        user_uploaded_file = UserUploadedFile.objects.get(id=file_id)
        file_path = str(user_uploaded_file.file.path)

        ocr = get_ocr_instance("hi", False)

        img = ocr.read_img(file_path)
        if img is None:
            raise ValueError("Image could not be loaded")

        text = ocr.get_text(img)
        if not text:
            raise ValueError("OCR could not extract text")

        text_str = " ".join(text) if isinstance(text, list) else str(text)

        result = generate_fir(text_str)

        if "error" in result and len(result) == 1:
            raise ValueError(f"GPT error: {result['error']}")

        Result.objects.filter(id=result_id).update(
            status="done",
            section_identified=result.get("section_identified", ""),
            offence_detected=result.get("offence_detected", ""),
            generated_explanation=result.get("generated_explanation", ""),
            punishment=result.get("punishment", ""),
            court=result.get("court", ""),
            is_cognizable=result.get("is_cognizable", True),
            is_bailable=result.get("is_bailable", True),
        )

    except Exception as e:
        print(traceback.format_exc())
        Result.objects.filter(id=result_id).update(
            status="error",
            error_message=str(e),
        )


# ---------------- PROCESS VIEW ----------------
class UserUploadedFileView(APIView):
    """
    Kicks off FIR processing in the background and immediately
    returns a result_id the frontend can poll via ResultStatusView.
    """

    def get(self, request, file_id):
        try:
            user_uploaded_file = UserUploadedFile.objects.get(id=file_id)
        except UserUploadedFile.DoesNotExist:
            return Response({"error": "Uploaded file not found"}, status=404)

        if not user_uploaded_file.file:
            return Response({"error": "Uploaded file not found"}, status=404)

        result = Result.objects.create(file=user_uploaded_file, status="processing")

        thread = threading.Thread(
            target=_process_fir,
            args=(file_id, result.id),
            daemon=True,
        )
        thread.start()

        return Response({
            "message": "Processing started",
            "result_id": result.id,
            "status": "processing",
        }, status=202)


# ---------------- STATUS / RESULT VIEW ----------------
class ResultStatusView(APIView):
    """
    Frontend polls this endpoint with the result_id returned above
    until status is 'done' or 'error'.
    """

    def get(self, request, result_id):
        try:
            result = Result.objects.get(id=result_id)
        except Result.DoesNotExist:
            return Response({"error": "Result not found"}, status=404)

        if result.status == "processing":
            return Response({"status": "processing"})

        if result.status == "error":
            return Response({
                "status": "error",
                "error": result.error_message,
            }, status=200)

        return Response({
            "status": "done",
            "data": {
                "section_identified": result.section_identified,
                "offence_detected": result.offence_detected,
                "generated_explanation": result.generated_explanation,
                "punishment": result.punishment,
                "court": result.court,
                "is_cognizable": result.is_cognizable,
                "is_bailable": result.is_bailable,
            },
        })
