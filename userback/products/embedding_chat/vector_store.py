import faiss
import numpy as np
import pickle
import os
from utils.ml_loader import EMBEDDING_DIM

BASE_DIR = os.path.dirname(__file__)
INDEX_PATH = os.path.join(BASE_DIR, "products.index")
MAP_PATH = os.path.join(BASE_DIR, "product_ids.pkl")

# ✅ SINGLE GLOBAL STATE (IMPORTANT)
_index = None
_product_id_map = None


def save_index(product_ids, embeddings):
    global _index, _product_id_map

    vectors = np.array(embeddings).astype("float32")

    _index = faiss.IndexFlatL2(EMBEDDING_DIM)
    _index.add(vectors)

    _product_id_map = product_ids

    faiss.write_index(_index, INDEX_PATH)
    with open(MAP_PATH, "wb") as f:
        pickle.dump(_product_id_map, f)


def load_index():
    """
    Load FAISS index and product_id_map ONCE per process.
    """
    global _index, _product_id_map

    if _index is not None and _product_id_map is not None:
        return

    if not os.path.exists(INDEX_PATH) or not os.path.exists(MAP_PATH):
        print("⚠️ FAISS index not found. Run embedding creation first.")
        _index = None
        _product_id_map = []
        return

    print("✅ Loading FAISS index from disk...")
    _index = faiss.read_index(INDEX_PATH)

    with open(MAP_PATH, "rb") as f:
        _product_id_map = pickle.load(f)


def search_vectors(query_vector, k=5):
    if _index is None or _product_id_map is None:
        load_index()

    if _index is None:
        return []

    q = np.array([query_vector]).astype("float32")
    distances, indices = _index.search(q, k)

    results = []
    for dist, idx in zip(distances[0], indices[0]):
        # if idx < len(_product_id_map):
            results.append({
                "product_id": _product_id_map[idx],
                "score": float(dist)  # LOWER = BETTER
            })

    return results
