# backlink_analysis/fetch_backlinks.py
import requests
from bs4 import BeautifulSoup

SERP_API_KEY = "ef996ea5206702f53618617d2fd6a85435ad51ce94b7d09fb7a1e28084e6af76"

def fetch_backlinks_via_serpapi(keyword, num_results=10):
    """Fetch top-ranking domains for a keyword using SerpApi."""
    url = "https://serpapi.com/search"
    params = {
        "engine": "google",
        "q": keyword,
        "api_key": SERP_API_KEY,
        "num": num_results
    }
    try:
        response = requests.get(url, params=params)
        data = response.json()
        links = [r["link"] for r in data.get("organic_results", []) if "link" in r]
        return list(set(links))
    except Exception as e:
        print(f"⚠️ SerpApi error: {e}")
        return []


def scrape_outbound_links(url):
    """Scrape outbound links from a webpage as a fallback."""
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        html = requests.get(url, headers=headers, timeout=10).text
        soup = BeautifulSoup(html, "html.parser")
        links = [a["href"] for a in soup.find_all("a", href=True)]
        valid_links = [
            link for link in links
            if link.startswith("http") and not link.startswith(url)
        ]
        return list(set(valid_links))
    except Exception as e:
        print(f"⚠️ Error scraping {url}: {e}")
        return []


def get_backlinks(keyword):
    """Hybrid: Fetch backlinks via SerpApi → fallback scraping."""
    backlinks = fetch_backlinks_via_serpapi(keyword)
    if not backlinks:
        print("🔁 Falling back to scraping Google search results manually.")
        search_url = f"https://www.google.com/search?q={keyword}"
        backlinks = scrape_outbound_links(search_url)
    return backlinks
