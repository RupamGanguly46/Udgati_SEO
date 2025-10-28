def keyword_content_score(keyword_overlap_score, content_similarity_score, kw_weight=0.6):
    return kw_weight * keyword_overlap_score + (1 - kw_weight) * content_similarity_score
