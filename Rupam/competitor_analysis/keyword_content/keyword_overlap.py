# Jaccard Similarity
def keyword_overlap(keywords1, keywords2):
    set1, set2 = set(keywords1), set(keywords2)
    intersection = set1.intersection(set2)
    union = set1.union(set2)
    return len(intersection) / len(union) if union else 0
