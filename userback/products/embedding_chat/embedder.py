# from utils.ml_loader import get_embedding_model
# from utils.ml_loader import get_embedding
# def embed_texts(texts):
#     embedding_model = get_embedding()
#     return embedding_model.encode(
#         texts,
#         convert_to_numpy=True,
#         show_progress_bar=False
#     )

# def embed_texts(texts):
#     embedding_model = get_embedding(texts)
#     return embedding_model.encode(
#         texts,
#         convert_to_numpy=True,
#         show_progress_bar=False
#     )

from utils.ml_loader import get_embedding
import numpy as np

def embed_texts(texts):
    embeddings = []

    for text in texts:
        vector = get_embedding(text)

        if vector is None:
            continue

        embeddings.append(vector)

    return np.array(embeddings, dtype="float32")