# infrastructure.py
import requests
from .utils.helpers import clamp
import dns.resolver
import tldextract

def check_cdn_and_cache(url: str) -> dict:
    try:
        r = requests.get(url, timeout=10)
        headers = {k.lower(): v for k, v in r.headers.items()}
        cdn = None
        for k, v in headers.items():
            if "cloudflare" in v.lower() or "akamai" in v.lower() or "fastly" in v.lower():
                cdn = v
                break
        cache = headers.get("cache-control", None) or headers.get("expires", None)
        proto = r.raw.version  # 11 => HTTP/1.1, 20 => httpx uses other; requests may give 11
        return {"cdn": cdn, "cache_control": cache, "http_version": proto}
    except Exception as e:
        return {"error": str(e)}

def dns_lookup_time(domain: str) -> dict:
    try:
        resolver = dns.resolver.Resolver()
        start = resolver.query  # just to ensure resolver exists
        # dns.resolver does not provide timing easily; do a simple query
        import time
        t0 = time.time()
        answers = dns.resolver.resolve(domain, 'A')
        t1 = time.time()
        return {"success": True, "time_ms": round((t1 - t0) * 1000, 2)}
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_infrastructure_score(url: str) -> dict:
    try:
        info = check_cdn_and_cache(url)
        domain = tldextract.extract(url).registered_domain
        dns_info = dns_lookup_time(domain) if domain else {"success": False}
        score = 0
        if info.get("cdn"):
            score += 40
        if info.get("cache_control"):
            score += 30
        # heuristics: faster dns -> more points
        if dns_info.get("success") and dns_info.get("time_ms", 999) < 200:
            score += 30
        return {"score": clamp(score), "details": {"headers": info, "dns": dns_info}}
    except Exception as e:
        return {"score": 0, "details": {"error": str(e)}}
