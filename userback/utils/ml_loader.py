# MODEL_NAME = "google/flan-t5-small"
# EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
# EMBEDDING_DIM = 384
# TOP_K = 5

# _t5_model = None
# _t5_tokenizer = None
# _embedding_model = None


# def get_t5_model():
#     global _t5_model, _t5_tokenizer

#     if _t5_model is None or _t5_tokenizer is None:
#         from transformers import T5Tokenizer, T5ForConditionalGeneration
        
#         _t5_tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
#         _t5_model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)

#     return _t5_model, _t5_tokenizer


# def get_embedding_model():
#     global _embedding_model

#     if _embedding_model is None:
#         from sentence_transformers import SentenceTransformer
        
#         _embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

#     return _embedding_model
import requests
import os

HF_TOKEN = os.getenv("HF_TOKEN")

def get_t5_model(prompt):
    API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small"

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}"
    }

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 120
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        return "Model is loading or unavailable. Try again."

    data = response.json()

    if isinstance(data, list):
        return data[0].get("generated_text", "No response generated.")

    return "Unexpected model response."


def get_embedding(text):
    API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}"
    }

    payload = {
        "inputs": text
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        return []

    data = response.json()

    if isinstance(data, list):
        return data[0]

    return []
