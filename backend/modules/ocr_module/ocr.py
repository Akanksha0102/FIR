import torch
import easyocr
import cv2
import numpy as np


class OCR:
    def __init__(self, lang: str, gpu: bool = True):
        super().__init__()

        self.lang_codes = {
            'en': 'en',
            'hi': 'hi',
            'ar': 'ar',
            'bn': 'bn',
            'mr': 'mr',
            'ta': 'ta',
            'te': 'te',
            'ur': 'ur',
        }

        if lang not in self.lang_codes.keys():
            raise ValueError(
                f"Language not supported: {self.lang_codes.keys()}"
            )

        self.lang = lang

        # force safe device selection
        self.device = torch.device(
            'cuda' if gpu and torch.cuda.is_available() else 'cpu'
        )

        if self.device.type == 'cpu' and gpu:
            print("GPU not available, using CPU instead")

        # ✅ OCR engine (ONLY EasyOCR, no translation models)
        self.reader = easyocr.Reader(
            [lang],
            gpu=(self.device.type == 'cuda')
        )

    def get_bbox(self, img) -> np.array:
        """Get bounding box of text"""
        bbox = np.array(self.reader.detect(img)[0][0])
        return bbox

    def read_img(self, img_path) -> np.array:
        """Read image and return RGB image"""
        img = cv2.imread(img_path)

        if img is None:
            raise ValueError(f"Image not found at path: {img_path}")

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        return img

    def get_text(self, img):
        """
        Extract text from image (NO TRANSLATION - SAFE VERSION)
        """

        text = self.reader.readtext(img)

        # EasyOCR returns: (bbox, text, confidence)
        extracted_text = []

        for item in text:
            if len(item) >= 2:
                extracted_text.append(item[1])  # only text

        return extracted_text