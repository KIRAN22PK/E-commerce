import os
import pickle
import pandas as pd
import numpy as np

from django.conf import settings
from products.models import UserOrder, UserCart
from sklearn.metrics.pairwise import cosine_similarity

MODEL_PATH = os.path.join(
    settings.BASE_DIR,
    "products",
    "recommender",
    "model.pkl"
)

def train_recommender():
    data = []

    # Strong signal: orders
    for o in UserOrder.objects.all():
        data.append([o.user_id, o.product_id, 3])

    # Weak signal: cart
    for c in UserCart.objects.all():
        data.append([c.user_id, c.product_id, 1])

    if not data:
        raise RuntimeError("No interaction data available")

    df = pd.DataFrame(data, columns=["user", "product", "score"])

    # Build user-product matrix
    matrix = df.pivot_table(
        index="user",
        columns="product",
        values="score",
        aggfunc="sum",
        fill_value=0
    )

    # Product-product similarity
    similarity = cosine_similarity(matrix.T)

    model = {
        "similarity": similarity,
        "product_ids": list(matrix.columns)
    }

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print("✅ Cosine recommender trained and saved")
