from bs4 import BeautifulSoup
import requests
import re
import pytesseract
from PIL import Image
import io
import base64

# Path to Tesseract (Windows setup)
pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

def clean_text(text: str) -> str:
    """Clean text: remove extra newlines/spaces."""
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

def extract_text_from_html(html_content: str, base_url: str = None) -> str:
    soup = BeautifulSoup(html_content, "html.parser")

    # Remove scripts, styles, and noscript
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    text_blocks = []

    # 1. Extract visible text
    visible_text = soup.get_text(separator="\n")
    if visible_text.strip():
        text_blocks.append(visible_text)

    # 2. Extract image text (OCR) if images exist
    images = soup.find_all("img")
    for img in images:
        src = img.get("src")

        try:
            # Case A: Base64-encoded image
            if src.startswith("data:image"):
                header, data = src.split(",", 1)
                img_data = base64.b64decode(data)
                pil_img = Image.open(io.BytesIO(img_data))
                ocr_text = pytesseract.image_to_string(pil_img).strip()
                if ocr_text:
                    text_blocks.append(ocr_text)

            # Case B: Linked image (absolute or relative URL)
            elif base_url and not src.startswith("data:"):
                img_url = src if src.startswith("http") else base_url.rstrip("/") + "/" + src.lstrip("/")
                img_data = requests.get(img_url).content
                pil_img = Image.open(io.BytesIO(img_data))
                ocr_text = pytesseract.image_to_string(pil_img).strip()
                if ocr_text:
                    text_blocks.append(ocr_text)

        except Exception as e:
            print(f"[Warning] Could not OCR image {src}: {e}")

    combined = "\n".join(text_blocks)
    return clean_text(combined)


# -----------------------
# Example usage
# -----------------------
if __name__ == "__main__":
    # # Load from a file
    # with open("./Keyword Extraction/sample.html", "r", encoding="utf-8") as f:
    #     html_data = f.read()

    # Or from a URL
    html_data = requests.get("https://www.york.ac.uk/teaching/cws/wws/webpage1.html").text

    extracted_text = extract_text_from_html(html_data, base_url="https://www.york.ac.uk/teaching/cws/wws/webpage1.html")
    print("Final Extracted Text:\n")
    print(extracted_text)
