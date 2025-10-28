# backlink_analysis/main.py
from backlink_analysis.analyzer import calculate_backlink_score

if __name__ == "__main__":
    keyword = input("Enter a keyword to analyze backlinks: ")
    score = calculate_backlink_score(keyword)
    print(f"🏁 Final backlink score for '{keyword}': {score:.2f}/100")
