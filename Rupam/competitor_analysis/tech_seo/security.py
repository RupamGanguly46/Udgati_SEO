# security.py
import socket, ssl
from urllib.parse import urlparse
import requests
from .utils.helpers import clamp

def check_https(url: str) -> dict:
    parsed = urlparse(url)
    scheme_ok = parsed.scheme == "https"
    return {"https": scheme_ok}

def check_ssl_cert(url: str) -> dict:
    parsed = urlparse(url)
    host = parsed.netloc.split(':')[0]
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((host, 443), timeout=6) as sock:
            with ctx.wrap_socket(sock, server_hostname=host) as ss:
                cert = ss.getpeercert()
                # examine expiry
                not_after = cert.get("notAfter")
                issuer = cert.get("issuer")
                return {"valid": True, "notAfter": not_after, "issuer": issuer}
    except Exception as e:
        return {"valid": False, "error": str(e)}

def mixed_content_check(url: str) -> dict:
    try:
        r = requests.get(url, timeout=10)
        html = r.text.lower()
        # simple heuristic: look for http:// inside page when served over https
        if url.startswith("https://"):
            if "http://" in html:
                return {"mixed": True}
        return {"mixed": False}
    except Exception as e:
        return {"mixed": None, "error": str(e)}

def get_security_score(url: str) -> dict:
    h = check_https(url)
    c = check_ssl_cert(url) if h["https"] else {"valid": False}
    m = mixed_content_check(url)
    score = 0
    score += 50 if h["https"] else 0
    score += 40 if c.get("valid") else 0
    score += 10 if not m.get("mixed", False) else 0
    return {"score": clamp(score), "details": {"https": h, "ssl": c, "mixed_content": m}}
