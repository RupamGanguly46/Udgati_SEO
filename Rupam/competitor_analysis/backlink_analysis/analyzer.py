# backlink_analysis/analyzer.py
from backlink_analysis.fetch_backlinks import get_backlinks
from backlink_analysis.openpagerank_api import get_pagerank
from backlink_analysis.whoapi_checker import get_domain_info
from backlink_analysis.scoring import quantity_score, authority_score, trust_score
from backlink_analysis.utils import extract_domain

def calculate_backlink_score(keyword):
    print(f"\n🔍 Analyzing backlinks for keyword: '{keyword}'")

    backlinks = get_backlinks(keyword)
    print(f"🌐 Found {len(backlinks)} backlinks.")

    domains = list(set([extract_domain(link) for link in backlinks]))
    print(f"🏷️ Extracted {len(domains)} unique domains.")

    # 1️⃣ Get PageRank (authority)
    domain_ranks = get_pagerank(domains)

    # 2️⃣ Get trust data (optional)
    domain_trust_scores = [get_domain_info(d) for d in domains[:10]]  # sample 10

    # 3️⃣ Calculate component scores
    q_score = quantity_score(backlinks)
    a_score = authority_score(domain_ranks)
    t_score = trust_score(domain_trust_scores)

    # 4️⃣ Combine weighted scores
    backlink_score = (
        0.5 * a_score +
        0.3 * t_score +
        0.2 * q_score
    )

    print(f"\n📊 Backlink Scores:")
    print(f"  - Quantity Score:     {q_score:.2f}")
    print(f"  - Authority Score:    {a_score:.2f}")
    print(f"  - Trustworthiness:    {t_score:.2f}")
    print(f"✅ Final Backlink Score: {backlink_score:.2f}/100\n")

    return backlink_score
