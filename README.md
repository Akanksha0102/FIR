# FIR Analysis System

An AI-powered FIR (First Information Report) analysis system that extracts text from FIR images/documents using OCR and generates structured legal insights using LLMs.

The project combines OCR and NLP to automate FIR processing and generate organized outputs from unstructured legal documents.

## Features

* Upload FIR images/documents
* OCR-based text extraction (EasyOCR)
* GPT-powered FIR analysis
* Structured legal output generation
* REST API architecture
* Store uploaded files and generated results
* Extensible OCR pipeline for future improvements

---

## Architecture

```text
React Frontend
      ↓
REST API
      ↓
Django REST Framework
      ↓
OCR (EasyOCR)
      ↓
Text Extraction
      ↓
OpenAI GPT
      ↓
Structured FIR Analysis
      ↓
Database
```

---

## Tech Stack

**Frontend**

* React.js

**Backend**

* Django
* Django REST Framework

**AI / ML**

* EasyOCR
* OpenAI API
* PyTorch

**Computer Vision**

* OpenCV
* NumPy

**Database**

* SQLite

---

## Project Structure

```text
backend/
├── ocr_app/
├── modules/
│   ├── ocr_module/
│   └── gpt_module/
├── media/
├── manage.py
└── requirements.txt
```

---

## API Endpoints

```http
POST /api/ocr/upload/
```

Upload FIR image/document

```http
GET /api/ocr/process/
```

Generate FIR analysis

---

## Setup

```bash
git clone <repo-url>
cd FIR-Analysis

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

Create `.env`

```env
OPENAI_API_KEY=your_key
```

---

## Future Improvements

* Multilingual support
* Custom Hindi OCR
* Authentication
* User dashboard

## Author
Akanksha Kumari
