import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# 👇 THIS is the key
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "reviews.csv")

# Load data
df = pd.read_csv(CSV_PATH)

X = df["review"]
y = df["label"]

vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    max_features=5000
)

X_tfidf = vectorizer.fit_transform(X)

model = LogisticRegression(max_iter=1000)
model.fit(X_tfidf, y)

joblib.dump(model, os.path.join(BASE_DIR, "sentiment_model.pkl"))
joblib.dump(vectorizer, os.path.join(BASE_DIR, "tfidf_vectorizer.pkl"))

print("✅ Model trained and saved")
