def extract_keywords(text, top_n=20):
    """
    Extract top N keywords from text using TF-IDF or RAKE.
    Returns a list of keywords.
    """
    # Example with TF-IDF
    from sklearn.feature_extraction.text import TfidfVectorizer

    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1,2))
    X = vectorizer.fit_transform([text])
    scores = zip(vectorizer.get_feature_names_out(), X.toarray()[0])
    sorted_keywords = sorted(scores, key=lambda x: x[1], reverse=True)
    top_keywords = [kw for kw, score in sorted_keywords[:top_n]]
    return top_keywords
