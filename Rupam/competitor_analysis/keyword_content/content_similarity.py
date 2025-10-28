def content_similarity(text1, text2):
    from sentence_transformers import SentenceTransformer, util

    model = SentenceTransformer('all-MiniLM-L6-v2')
    emb1 = model.encode(text1, convert_to_tensor=True)
    emb2 = model.encode(text2, convert_to_tensor=True)
    score = util.pytorch_cos_sim(emb1, emb2).item()  # 0–1
    return score
