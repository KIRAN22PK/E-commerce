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
    API_URL = "https://router.huggingface.co/hf-inference/models/google/flan-t5-small"

    headers = {
        "Authorization": f"Bearer {os.getenv('HF_TOKEN')}"
    }

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 120
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    data = response.json()

    if isinstance(data, dict) and "error" in data:
        print("HF ERROR:", data)
        return "Model error"

    return data[0]["generated_text"]
# from sentence_transformers import SentenceTransformer

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 384

_embedding_model = None

import requests
import os

HF_TOKEN = os.getenv("HF_TOKEN")

def get_embedding(text):
    API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2"

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}"
    }

    payload = {
        "inputs": text
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    data = response.json()

    if isinstance(data, dict) and "error" in data:
        print("HF EMBEDDING ERROR:", data)
        return None

    return data  # returns embedding vector list



# def get_embedding(text):
#     API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2"

#     headers = {
#         "Authorization": f"Bearer {os.getenv('HF_TOKEN')}"
#     }

#     payload = {
#         "inputs": text
#     }

#     response = requests.post(API_URL, headers=headers, json=payload)

#     data = response.json()

#     if isinstance(data, dict) and "error" in data:
#         print("HF ERROR:", data)
#         return None

#     return data[0]


