# accessibility.py
import requests
from bs4 import BeautifulSoup
from .utils.helpers import clamp

def accessibility_checks(url: str) -> dict:
    try:
        r = requests.get(url, timeout=10)
        soup = BeautifulSoup(r.text, "lxml")
        imgs = soup.find_all("img")
        imgs_with_alt = [i for i in imgs if i.get("alt")]
        alt_ratio = len(imgs_with_alt) / len(imgs) if imgs else 1.0
        title = bool(soup.title and soup.title.string)
        headings = len(soup.find_all(["h1", "h2"]))
        score = (alt_ratio * 70) + (30 if title else 0)
        return {"score": clamp(score), "details": {"img_total": len(imgs), "imgs_with_alt": len(imgs_with_alt), "title": title, "headings": headings}}
    except Exception as e:
        return {"score": 0, "details": {"error": str(e)}}
