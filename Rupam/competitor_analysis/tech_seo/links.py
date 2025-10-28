# links.py
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import requests
from .utils.helpers import clamp

async def head_check(session, url):
    try:
        async with session.head(url, timeout=8, allow_redirects=True) as r:
            return r.status
    except Exception:
        try:
            async with session.get(url, timeout=8, allow_redirects=True) as r:
                return r.status
        except Exception:
            return None

async def check_links_async(links):
    async with aiohttp.ClientSession() as session:
        tasks = [head_check(session, l) for l in links]
        return await asyncio.gather(*tasks)

def extract_links(page_html: str, base_url: str):
    soup = BeautifulSoup(page_html, "lxml")
    a_tags = soup.find_all("a", href=True)
    links = []
    for a in a_tags:
        href = a['href'].strip()
        if href.startswith("http"):
            links.append(href)
    # dedupe
    return list(dict.fromkeys(links))

def get_link_score(url: str) -> dict:
    try:
        r = requests.get(url, timeout=10)
        links = extract_links(r.text, url)
        if not links:
            return {"score": 100, "details": {"checked": 0}}
        statuses = asyncio.run(check_links_async(links[:200]))  # limit to first 200 links
        ok = sum(1 for s in statuses if s and 200 <= s < 400)
        total = len(statuses)
        rate = ok / total if total else 1.0
        score = clamp(rate * 100)
        return {"score": score, "details": {"total_links_checked": total, "ok": ok, "rate": rate}}
    except Exception as e:
        return {"score": 0, "details": {"error": str(e)}}
