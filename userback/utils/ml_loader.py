MODEL_NAME = "google/flan-t5-small"
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 384
TOP_K = 5

_t5_model = None
_t5_tokenizer = None
_embedding_model = None


def get_t5_model():
    global _t5_model, _t5_tokenizer

    if _t5_model is None or _t5_tokenizer is None:
        from transformers import T5Tokenizer, T5ForConditionalGeneration
        
        _t5_tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
        _t5_model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)

    return _t5_model, _t5_tokenizer


def get_embedding_model():
    global _embedding_model

    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

    return _embedding_model
