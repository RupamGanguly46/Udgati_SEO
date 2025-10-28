# backlink_analysis/openpagerank_api.py
import requests

OPR_API_KEY = "0s00wsk8gcsg8scw0o8csskc440cs8kcwwcwwsgo"
OPR_BASE_URL = "https://openpagerank.com/api/v1.0/getPageRank"

def get_pagerank(domains):
    """Get PageRank scores for a list of domains via OpenPageRank API."""
    try:
        payload = {"domains[]": domains}
        headers = {"API-OPR": OPR_API_KEY}
        response = requests.get(OPR_BASE_URL, headers=headers, params=payload)
        data = response.json().get("response", [])
        result = {}
        for d in data:
            domain = d.get("domain")
            rank = d.get("page_rank_decimal", 0)
            result[domain] = rank
        return result
    except Exception as e:
        print(f"⚠️ OpenPageRank API error: {e}")
        return {d: 0 for d in domains}
