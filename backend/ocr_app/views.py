from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import UserUploadedFile, Result
from modules.ocr_module.ocr import OCR
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


# ---------------- PROCESS VIEW ----------------
class UserUploadedFileView(APIView):

    def get(self, request, file_id):

        try:
            user_uploaded_file = UserUploadedFile.objects.get(id=file_id)

            file_path = user_uploaded_file.file.path
            print("FILE:", file_path)

            # OCR
            ocr = OCR('hi', False)
            img = ocr.read_img(file_path)

            text = ocr.get_text(img)
            # ⚠️ FIX: convert OCR output properly
            text_str = " ".join(text) if isinstance(text, list) else str(text)

            
            if not text:
             return Response({
               "error": "OCR could not extract any text"
             }, status=400)

            text_str = " ".join(text)

            # GPT
            result = generate_fir(text_str)

            print("GPT RESULT:", result)  # 🔥 DEBUG IMPORTANT

            # Save to DB
            Result.objects.create(
                file=user_uploaded_file,
                section_identified=result.get("section_identified", ""),
                offence_detected=result.get("offence_detected", ""),
                generated_explanation=result.get("generated_explanation", ""),
                punishment=result.get("punishment", ""),
                court=result.get("court", ""),
                is_cognizable=result.get("is_cognizable", True),
                is_bailable=result.get("is_bailable", True),
            )

            return Response({
                "message": "FIR generated successfully",
                "data": result   # 🔥 MUST BE FULL RESULT
            })

        except Exception as e:
            import traceback
            print(traceback.format_exc())

            return Response({
                "error": str(e)
            }, status=500)