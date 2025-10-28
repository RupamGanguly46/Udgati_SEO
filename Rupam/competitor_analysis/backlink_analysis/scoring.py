# backlink_analysis/scoring.py
import statistics

def quantity_score(backlinks):
    """Score based on how many backlinks a site has."""
    if not backlinks:
        return 0
    total = len(backlinks)
    return min(total / 50, 1.0) * 100  # 100 = excellent, if ≥50 backlinks


def authority_score(domain_ranks):
    """Average PageRank score from OpenPageRank results."""
    if not domain_ranks:
        return 0
    avg_rank = statistics.mean(domain_ranks.values())
    return min(avg_rank / 10, 1.0) * 100


def trust_score(domain_trust_scores):
    """Average trust score from WhoAPI (0–100)."""
    if not domain_trust_scores:
        return 0
    avg_trust = statistics.mean(domain_trust_scores)
    return avg_trust
