import io
from typing import List, Dict, Any
from pypdf import PdfReader
from docx import Document as DocxDocument

def extract_text_from_file(file_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
    """
    Extracts text from file bytes based on file extension.
    Returns a list of pages/sections with page numbers and text content:
    [{"page": 1, "text": "..."}, {"page": 2, "text": "..."}]
    """
    ext = filename.split(".")[-1].lower()
    pages_data = []

    if ext == "pdf":
        try:
            pdf = PdfReader(io.BytesIO(file_bytes))
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                if text.strip():
                    pages_data.append({"page": i + 1, "text": text.strip()})
        except Exception as e:
            pages_data.append({"page": 1, "text": file_bytes.decode("utf-8", errors="ignore")})

    elif ext in ["docx", "doc"]:
        try:
            doc = DocxDocument(io.BytesIO(file_bytes))
            full_text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
            pages_data.append({"page": 1, "text": full_text})
        except Exception:
            pages_data.append({"page": 1, "text": file_bytes.decode("utf-8", errors="ignore")})

    else:
        # Markdown, TXT, or plain text
        raw_text = file_bytes.decode("utf-8", errors="ignore")
        # Split by page dividers if present, else single page
        sections = raw_text.split("---")
        for i, sec in enumerate(sections):
            if sec.strip():
                pages_data.append({"page": i + 1, "text": sec.strip()})

    if not pages_data:
        pages_data.append({"page": 1, "text": file_bytes.decode("utf-8", errors="ignore")})

    return pages_data
