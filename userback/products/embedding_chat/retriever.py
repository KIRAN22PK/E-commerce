from products.embedding_chat.vector_store import search_vectors
from .embedder import embed_texts
from utils.ml_loader import get_embedding
import numpy as np

def retrieve_products(query, top_k=10):
    # model=get_embedding()
    # query_vector = model.encode(query).astype("float32")
    # return search_vectors(query_vector, k=top_k)
    embedding = get_embedding(query)

    if not embedding:
        return []

    # HF returns [[vector]]
    query_vector = np.array(embedding[0]).astype("float32")

    return search_vectors(query_vector, k=top_k)
