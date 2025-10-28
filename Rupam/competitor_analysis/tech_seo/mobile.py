# mobile.py
import os
import json
import requests
from bs4 import BeautifulSoup
from .utils.helpers import clamp, normalize_score
from playwright.sync_api import sync_playwright

MOBILE_API_KEY = "AIzaSyAAxzVWuOxWvp3TNS-HeHe6-buwbhSf41M"  # optional
MOBILE_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"  # using PSI mobile strategy as fallback

def simple_meta_viewport_check(url: str) -> dict:
    try:
        r = requests.get(url, timeout=10)
        soup = BeautifulSoup(r.text, "lxml")
        meta = soup.find("meta", attrs={"name": "viewport"})
        return {"viewport": bool(meta)}
    except Exception as e:
        return {"viewport": None, "error": str(e)}

def mobile_render_check(url: str) -> dict:
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36")
            page.set_viewport_size({"width": 412, "height": 915})  # typical mobile
            page.goto(url, timeout=20000)
            # basic heuristics: viewport width of content
            bounding = page.evaluate("() => ({innerWidth: window.innerWidth, documentWidth: document.documentElement.scrollWidth})")
            browser.close()
            return {"render_mobile_inner_width": bounding.get("innerWidth"), "doc_width": bounding.get("documentWidth")}
    except Exception as e:
        return {"error": str(e)}

def pagespeed_mobile(url: str) -> dict:
    params = {"url": url, "strategy": "mobile"}
    key = os.getenv("PAGESPEED_API_KEY")
    if key:
        params["key"] = key
    try:
        r = requests.get(MOBILE_API_URL, params=params, timeout=30)
        r.raise_for_status()
        j = r.json()
        perf = j.get("lighthouseResult", {}).get("categories", {}).get("performance", {}).get("score")
        return {"psi_performance": perf * 100 if perf is not None else None}
    except Exception as e:
        return {"error": str(e)}

def get_mobile_score(url: str) -> dict:
    meta = simple_meta_viewport_check(url)
    render = mobile_render_check(url)
    psi = pagespeed_mobile(url)
    # Score heuristics
    s_view = 100 if meta.get("viewport") else 60
    s_render = 100 if (render.get("render_mobile_inner_width") and render.get("render_mobile_inner_width") <= 420) else 70
    s_psi = psi.get("psi_performance") if isinstance(psi, dict) and psi.get("psi_performance") else 0
    # combine
    score = (0.3 * s_view) + (0.3 * s_render) + (0.4 * (s_psi if s_psi else 70))
    return {"score": clamp(score), "details": {"viewport_meta": meta, "render": render, "psi": psi}}
