import fitz  # PyMuPDF
import pytesseract
import re
import io
from PIL import Image

# ---------------------
# Paths
# ---------------------
pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

# ---------------------
# Cleaning helper
# ---------------------
def clean_text(text: str) -> str:
    """Remove unnecessary spaces and newlines."""
    text = re.sub(r'\n+', '\n', text)          # collapse multiple newlines
    text = re.sub(r'[ \t]+', ' ', text)        # collapse multiple spaces
    text = re.sub(r' *\n *', '\n', text)       # trim spaces around newlines
    return text.strip()

# ---------------------
# Main Extraction
# ---------------------
def extract_text_from_pdf(pdf_path: str) -> str:
    final_content = []

    try:
        doc = fitz.open(pdf_path)
        print(f"[INFO] Opened PDF: {pdf_path}, total pages = {len(doc)}")

        for page_num, page in enumerate(doc, start=1):
            page_content = []

            try:
                # 1. Extract selectable text
                text = page.get_text("text").strip()
                if text:
                    page_content.append(text)

                # 2. Extract OCR for embedded images
                images = page.get_images(full=True)
                if images:
                    print(f"[INFO] Found {len(images)} image(s) on page {page_num}, running OCR...")
                    for img in images:
                        try:
                            xref = img[0]
                            base_image = doc.extract_image(xref)
                            img_bytes = base_image["image"]
                            pil_img = Image.open(io.BytesIO(img_bytes))
                            ocr_text = pytesseract.image_to_string(pil_img).strip()
                            if ocr_text:
                                page_content.append(ocr_text)
                        except Exception as e:
                            print(f"[WARNING] OCR failed on page {page_num}: {e}")

                # 3. Fallback OCR on full page (if no text/images found)
                if not page_content:
                    print(f"[INFO] Page {page_num} empty, fallback OCR on full page...")
                    pix = page.get_pixmap(dpi=300)
                    pil_img = Image.open(io.BytesIO(pix.tobytes("png")))
                    ocr_text = pytesseract.image_to_string(pil_img).strip()
                    if ocr_text:
                        page_content.append(ocr_text)

            except Exception as e:
                print(f"[ERROR] Failed to process page {page_num}: {e}")

            # Add page content to final result
            if page_content:
                final_content.append("\n".join(page_content))

        doc.close()

    except Exception as e:
        print(f"[CRITICAL] Could not open PDF: {e}")

    # Final cleaning
    combined = "\n".join(final_content)
    return clean_text(combined)


# ---------------------
# Example usage
# ---------------------
if __name__ == "__main__":
    pdf_path = "./Keyword Extraction/Sample.pdf"
    extracted_text = extract_text_from_pdf(pdf_path)

    print("\n==================== Final Extracted Text ====================\n")
    print(extracted_text)
