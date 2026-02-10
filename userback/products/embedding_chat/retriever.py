from products.embedding_chat.vector_store import search_vectors
from .embedder import embed_texts

def retrieve_products(query, top_k=10):
    query_vector = embed_texts.encode(query)
    return search_vectors(query_vector, k=top_k)
