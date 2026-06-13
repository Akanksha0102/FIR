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
        torch.set_num_threads(1)

        self.reader = easyocr.Reader(
            [lang],
            gpu=(self.device.type == 'cuda')
        )

    def get_bbox(self, img) -> np.array:
        """Get bounding box of text"""
        bbox = np.array(self.reader.detect(img)[0][0])
        return bbox

    def read_img(self, img_path, max_dim: int = 1600) -> np.array:
        """Read image, downscale if too large, and return RGB image"""
        img = cv2.imread(img_path)

        if img is None:
            raise ValueError(f"Image not found at path: {img_path}")

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        h, w = img.shape[:2]
        longest_side = max(h, w)
        if longest_side > max_dim:
            scale = max_dim / float(longest_side)
            new_w, new_h = int(w * scale), int(h * scale)
            img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

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
    
    
_ocr_instances = {}


def get_ocr_instance(lang: str = "hi", gpu: bool = False) -> "OCR":
    """Return a cached OCR instance for the given language."""
    key = (lang, gpu)
    if key not in _ocr_instances:
        _ocr_instances[key] = OCR(lang, gpu)
    return _ocr_instances[key]