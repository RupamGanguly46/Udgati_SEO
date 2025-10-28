# backlink_analysis/whoapi_checker.py
import requests

WHOAPI_KEY = "1554d92e89a9e37a0d6924a8477710aa"

def get_domain_info(domain):
    """Fetch domain trust metrics (age, SSL, blacklist) from WhoAPI."""
    try:
        url = f"https://api.whoapi.com/?domain={domain}&r=whois&apikey={WHOAPI_KEY}"
        response = requests.get(url, timeout=10)
        data = response.json()

        domain_age = data.get("domain_age", 0)
        ssl = data.get("is_ssl", False)
        blacklist = data.get("is_blacklisted", False)

        trust_score = 0
        if ssl: trust_score += 0.4
        if domain_age and domain_age > 5: trust_score += 0.4
        if not blacklist: trust_score += 0.2

        return round(trust_score * 100, 2)
    except Exception as e:
        print(f"⚠️ WhoAPI error for {domain}: {e}")
        return 0
