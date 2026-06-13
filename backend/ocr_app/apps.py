import os
from django.apps import AppConfig


class OcrAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ocr_app"

    def ready(self):
        if os.environ.get("RUN_MAIN") == "true":
            return

        try:
            from modules.ocr_module.ocr import get_ocr_instance
            get_ocr_instance("hi", False)
            print("OCR model preloaded successfully at startup.")
        except Exception as e:
            print(f"OCR preload skipped/failed: {e}")