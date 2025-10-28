# backlink_analysis/utils.py
from urllib.parse import urlparse

def extract_domain(url):
    """Extract domain name from a URL."""
    try:
        parsed = urlparse(url)
        return parsed.netloc.replace("www.", "")
    except Exception:
        return url
