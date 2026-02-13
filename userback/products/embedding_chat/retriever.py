from products.embedding_chat.vector_store import search_vectors
from .embedder import embed_texts
from utils.ml_loader import get_embedding_model

def retrieve_products(query, top_k=10):
    model=get_embedding_model()
    query_vector = model.encode(query).astype("float32")
    return search_vectors(query_vector, k=top_k)
