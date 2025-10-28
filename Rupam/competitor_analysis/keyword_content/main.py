# main.py
from keyword_content.content_extractor import get_page_text
from keyword_content.keyword_extractor import extract_keywords
from keyword_content.keyword_overlap import keyword_overlap
from keyword_content.content_similarity import content_similarity
from keyword_content.score import keyword_content_score

# Example URLs
url1 = 'https://www.goglogo.com/'
url2 = 'https://www.google.com/'

# 1. Get page text
text1 = get_page_text(url1)
text2 = get_page_text(url2)

# 2. Extract keywords
keywords1 = extract_keywords(text1)
keywords2 = extract_keywords(text2)

# 3. Keyword overlap
kw_overlap = keyword_overlap(keywords1, keywords2)

# 4. Content similarity
cont_similarity = content_similarity(text1, text2)

# 5. Combine scores
final_score = keyword_content_score(kw_overlap, cont_similarity)

print(f"Keyword Overlap: {kw_overlap:.2f}")
print(f"Content Similarity: {cont_similarity:.2f}")
print(f"Final Keyword & Content Score: {final_score:.2f}")
