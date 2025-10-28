# performance.py
import os
import requests
from .utils.helpers import normalize_score, safe_get
from typing import Dict

PAGESPEED_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
API_KEY = "AIzaSyAAxzVWuOxWvp3TNS-HeHe6-buwbhSf41M" # optional

def fetch_pagespeed(url: str, strategy: str = "mobile") -> Dict:
    """Call PageSpeed Insights. Returns parsed metrics or empty dict on failure."""
    params = {"url": url, "strategy": strategy}
    if API_KEY:
        params["key"] = API_KEY
    try:
        r = requests.get(PAGESPEED_API, params=params, timeout=30)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        # Fallback: return empty dict
        print("[performance] PageSpeed API error:", e)
        return {}

def parse_pagespeed_json(js: dict) -> dict:
    lr = {}
    try:
        audits = js.get("lighthouseResult", {}).get("audits", {})
        lr["lcp_ms"] = safe_get(audits, "largest-contentful-paint", "numericValue", default=None)
        # cumulative layout shift reported as score (0..1)
        lr["cls"] = safe_get(audits, "cumulative-layout-shift", "numericValue", default=None)
        lr["fcp_ms"] = safe_get(audits, "first-contentful-paint", "numericValue", default=None)
        lr["tti_ms"] = safe_get(audits, "interactive", "numericValue", default=None)
        lr["speed_index"] = safe_get(audits, "speed-index", "numericValue", default=None)
        lr["performance_score"] = safe_get(js, "lighthouseResult", "categories", "performance", "score", default=None)
        if lr["performance_score"] is not None:
            lr["performance_score"] = lr["performance_score"] * 100
    except Exception as e:
        print("[performance] parse error:", e)
    return lr

def get_performance_score(url: str) -> dict:
    """Returns {'score':0-100, 'details': {...}}"""
    data = fetch_pagespeed(url)
    parsed = parse_pagespeed_json(data)
    # Heuristics & normalization:
    # LCP: good <= 2500ms, poor >= 4000ms
    lcp = parsed.get("lcp_ms")
    cls = parsed.get("cls")
    perf_num = parsed.get("performance_score")
    # compute component scores
    lcp_score = normalize_score(lcp if lcp is not None else 5000, 0, 4000, invert=True)
    cls_score = normalize_score(cls if cls is not None else 1.0, 0, 1.0, invert=True)
    perf_score = perf_num if perf_num is not None else (0)
    # weighted combine
    score = 0.5 * perf_score + 0.3 * lcp_score + 0.2 * cls_score
    score = round(score, 2)
    return {
        "score": score,
        "details": {
            "lcp_ms": lcp, "cls": cls, "performance_score": perf_num,
            "lcp_score": lcp_score, "cls_score": cls_score, "psi_score": perf_score
        }
    }
