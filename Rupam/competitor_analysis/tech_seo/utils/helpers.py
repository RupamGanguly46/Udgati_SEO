# utils/helpers.py
import os
import time
import json
import math
from urllib.parse import urlparse

def normalize_score(value, low, high, invert=False):
    """Normalize value to 0-100. If invert=True, lower original value = higher score."""
    try:
        v = float(value)
    except Exception:
        return 0.0
    if invert:
        v = max(min(v, high), low)
        # invert: lower v -> higher score
        norm = (high - v) / (high - low) if high != low else 0
    else:
        v = max(min(v, high), low)
        norm = (v - low) / (high - low) if high != low else 0
    return round(max(0.0, min(1.0, norm)) * 100, 2)

def clamp(v, a=0, b=100):
    try:
        v = float(v)
    except:
        return a
    return max(a, min(b, v))

def safe_get(d, *keys, default=None):
    for k in keys:
        if isinstance(d, dict) and k in d:
            d = d[k]
        else:
            return default
    return d

def domain_of(url):
    try:
        return urlparse(url).netloc.lower()
    except:
        return url
