# structured_data.py
import requests
from extruct import extract
from w3lib.html import get_base_url
from .utils.helpers import clamp

def get_schema_info(url: str) -> dict:
    try:
        r = requests.get(url, timeout=15)
        base = get_base_url(r.text, url)
        data = extract(r.text, base_url=base)
        total = sum(len(v) for v in data.values())
        types = set()
        for items in data.values():
            for it in items:
                if isinstance(it, dict):
                    t = it.get("@type") or it.get("type")
                    if t:
                        if isinstance(t, list):
                            types.update([x for x in t])
                        else:
                            types.add(t)
        return {"count": total, "types": list(types)}
    except Exception as e:
        return {"error": str(e), "count": 0, "types": []}

def get_schema_score(url: str) -> dict:
    info = get_schema_info(url)
    count = info.get("count", 0)
    if count == 0:
        score = 0
    elif count < 3:
        score = 60
    else:
        score = 100
    return {"score": clamp(score), "details": info}
