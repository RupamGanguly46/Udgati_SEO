# main.py
import sys
import argparse
from pathlib import Path

# When this file is executed directly (python main.py) we want to behave like
# the package was executed (python -m competitor_analysis.tech_seo.main).
# This bootstrap makes the repository root importable and sets __package__ so
# relative imports below work in both direct and module execution modes.
if __name__ == "__main__" and __package__ is None:
    repo_root = Path(__file__).resolve().parents[2]  # <repo_root>/competitor_analysis/tech_seo/main.py
    if str(repo_root) not in sys.path:
        sys.path.insert(0, str(repo_root))
    # Set package to the full package path so relative imports are allowed
    __package__ = "competitor_analysis.tech_seo"

# Use package-relative imports so this module works when run directly or via -m
from .utils.helpers import clamp
from .performance import get_performance_score
from .security import get_security_score
from .crawlability import get_crawlability_score
from .mobile import get_mobile_score
from .structured_data import get_schema_score
from .links import get_link_score
from .infrastructure import get_infrastructure_score
from .accessibility import accessibility_checks
from .internal_links_graph import internal_link_metrics
from rich import print

WEIGHTS = {
    "performance": 0.30,
    "crawlability": 0.18,
    "mobile": 0.12,
    "security": 0.10,
    "links": 0.12,
    "schema": 0.06,
    "infrastructure": 0.05,
    "accessibility": 0.04,
    # internal links used as minor boost
    "internal_links": 0.03
}

def compute_final_score(url: str):
    print(f"[bold]Starting audit for:[/] {url}\n")

    perf = get_performance_score(url)
    print("[green]Performance score:[/]", perf["score"])

    sec = get_security_score(url)
    print("[green]Security score:[/]", sec["score"])

    crawl = get_crawlability_score(url)
    print("[green]Crawlability score:[/]", crawl["score"])

    mob = get_mobile_score(url)
    print("[green]Mobile score:[/]", mob["score"])

    schema = get_schema_score(url)
    print("[green]Structured data score:[/]", schema["score"])

    link = get_link_score(url)
    print("[green]Links score:[/]", link["score"])

    infra = get_infrastructure_score(url)
    print("[green]Infrastructure score:[/]", infra["score"])

    acc = accessibility_checks(url)
    print("[green]Accessibility score:[/]", acc["score"])

    internal = internal_link_metrics(url)
    # small heuristic: nodes -> better means better internal structure
    internal_bonus = min(100, internal.get("nodes", 0))  # treat nodes as count
    internal_score = internal_bonus
    print("[green]Internal link nodes (count):[/]", internal.get("nodes", 0))

    # Compose weighted score
    scores = {
        "performance": perf["score"],
        "crawlability": crawl["score"],
        "mobile": mob["score"],
        "security": sec["score"],
        "links": link["score"],
        "schema": schema["score"],
        "infrastructure": infra["score"],
        "accessibility": acc["score"],
        "internal_links": internal_score
    }

    total = sum(scores[k] * WEIGHTS.get(k, 0) for k in scores)
    total = clamp(total, 0, 100)

    print("\n[bold cyan]--- Breakdown ---[/]")
    for k, v in scores.items():
        print(f"{k:15}: {v} × weight {WEIGHTS.get(k, 0)}")

    print(f"\n[bold magenta]Final Technical SEO Score for {url}: {round(total,2)} / 100[/]")
    print("\n[bold]Details (JSON-like):[/]")
    details = {
        "performance": perf,
        "security": sec,
        "crawlability": crawl,
        "mobile": mob,
        "schema": schema,
        "links": link,
        "infrastructure": infra,
        "accessibility": acc,
        "internal_links": internal
    }
    print(details)
    return total, details

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Technical SEO Score for a website")
    parser.add_argument("url", help="Website URL (with https://)")
    args = parser.parse_args()
    compute_final_score(args.url)
