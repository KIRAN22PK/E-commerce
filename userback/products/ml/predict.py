import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "sentiment_model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "tfidf_vectorizer.pkl"))

def predict_sentiment(text: str) -> str:
    """
    Input: review text
    Output: positive / neutral / negative
    """
    vector = vectorizer.transform([text])
    prediction = model.predict(vector)[0]
    return prediction


def sentiment_to_stars(sentiment: str) -> int:
    """
    Converts sentiment to star rating
    """
    mapping = {
        "negative": 1,
        "neutral": 3,
        "positive": 5
    }
    return mapping.get(sentiment, 3)
