from .config import EMBEDDING_MODEL_NAME
from sentence_transformers import SentenceTransformer
embedding_model= SentenceTransformer(EMBEDDING_MODEL_NAME)
def embed_texts(texts):
    return embedding_model.encode(
        texts,
        convert_to_numpy=True,
        show_progress_bar=False
    )
