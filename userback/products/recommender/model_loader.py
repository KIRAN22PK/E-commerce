import pickle
import os
from django.conf import settings

MODEL_PATH = os.path.join(
    settings.BASE_DIR,
    "products",
    "recommender",
    "model.pkl"
)

_model = None

def load_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise RuntimeError("Recommender model not trained yet")
        with open(MODEL_PATH, "rb") as f:
            _model = pickle.load(f)
    return _model
