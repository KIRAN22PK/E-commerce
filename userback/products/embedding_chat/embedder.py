from utils.ml_loader import get_embedding_model


def embed_texts(texts):
    embedding_model = get_embedding_model()
    return embedding_model.encode(
        texts,
        convert_to_numpy=True,
        show_progress_bar=False
    )
