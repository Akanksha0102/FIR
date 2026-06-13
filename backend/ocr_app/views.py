from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import UserUploadedFile, Result
from modules.ocr_module.ocr import get_ocr_instance

from modules.gpt_module.gpt import generate_fir

import tempfile


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

            if not user_uploaded_file.file:
                return Response(
                    {"error": "Uploaded file not found"},
                    status=404
                )

            file = user_uploaded_file.file

            print("FILE NAME:", file.name)

            # ---------------- SAFE FILE HANDLING (IMPORTANT FIX) ----------------
            # Render-safe: do NOT rely on .path
            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name

            print("TEMP FILE PATH:", tmp_path)





            # ---------------- OCR ----------------
            print("FILE EXISTS:", bool(user_uploaded_file.file))
            print("FILE NAME:", user_uploaded_file.file.name)
            print("FILE PATH:", getattr(user_uploaded_file.file, "path", None))
            ocr = get_ocr_instance("hi", False)


            img = ocr.read_img(tmp_path)

            if img is None:
                return Response(
                    {"error": "Image could not be loaded"},
                    status=400
                )

            text = ocr.get_text(img)

            if not text:
                return Response(
                    {"error": "OCR could not extract text"},
                    status=400
                )

            text_str = (
                " ".join(text)
                if isinstance(text, list)
                else str(text)
            )

            print("OCR TEXT:", text_str[:300])

            # ---------------- GPT ----------------
            result = generate_fir(text_str)

            print("GPT RESULT:", result)

            # ---------------- SAVE RESULT ----------------
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
                "data": result
            }, status=200)

        except UserUploadedFile.DoesNotExist:
            return Response(
                {"error": "File ID does not exist"},
                status=404
            )

        except Exception as e:
            import traceback
            print(traceback.format_exc())

            return Response(
                {"error": str(e)},
                status=500
            )