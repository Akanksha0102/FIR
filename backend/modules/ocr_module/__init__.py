from .ocr import OCR, get_ocr_instance
import cv2
import numpy as np
import torch
import easyocr
import os
# NOTE: transformers / Translator (mBART) intentionally NOT imported here.
# They pull in a ~2.4GB model and are not used in the live OCR->GPT flow.
# Import `from .translation import Translator` directly where needed.