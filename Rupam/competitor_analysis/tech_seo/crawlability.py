# crawlability.py
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from .utils.helpers import clamp

def fetch_status(url):
    try:
        r = requests.get(url, timeout=10, allow_redirects=True)
        return r.status_code, r.text, r.headers
    except Exception as e:
        return None, None, {"error": str(e)}

def check_robots(url: str) -> dict:
    base = url.rstrip("/")
    robots_url = base + "/robots.txt"
    code, text, _ = fetch_status(robots_url)
    has_robots = (code == 200 and "User-agent" in (text or ""))
    return {"exists": has_robots, "status_code": code}

def check_sitemap(url: str) -> dict:
    base = url.rstrip("/")
    sitemap_urls = [base + "/sitemap.xml", base + "/sitemap_index.xml"]
    for s in sitemap_urls:
        code, text, _ = fetch_status(s)
        if code == 200 and text and "<urlset" in text.lower():
            return {"exists": True, "url": s}
    return {"exists": False}

def find_canonical_issues(url: str) -> dict:
    code, text, _ = fetch_status(url)
    if code != 200 or not text:
        return {"ok": False, "error": "fetch_failed"}
    soup = BeautifulSoup(text, "lxml")
    canon = soup.find("link", rel="canonical")
    return {"canonical_present": bool(canon), "canonical_href": canon['href'] if canon else None}

def get_crawlability_score(url: str) -> dict:
    r = check_robots(url)
    s = check_sitemap(url)
    c = find_canonical_issues(url)
    score = 0
    score += 40 if r.get("exists") else 0
    score += 40 if s.get("exists") else 0
    score += 20 if c.get("canonical_present") else 0
    return {"score": clamp(score), "details": {"robots": r, "sitemap": s, "canonical": c}}
