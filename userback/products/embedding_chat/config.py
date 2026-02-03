from sentence_transformers import SentenceTransformer

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 384
TOP_K = 5

# # Load once (production-friendly)
# embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
