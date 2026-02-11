import requests
import os

HF_TOKEN = os.getenv("HF_TOKEN")

def generate_answer_t5(context: str, query: str, max_length=150):

    prompt = f"""
    Answer the question using only the given context.
    Given context has 2 products with their attributes and values.
    Give a concise answer by comparing the 2 products.

    Context:
    {context}

    Question:
    {query}
    """

    response = requests.post(
        "https://api-inference.huggingface.co/models/google/flan-t5-small",
        headers={
            "Authorization": f"Bearer {HF_TOKEN}"
        },
        json={
            "inputs": prompt,
            "parameters": {
                "max_length": max_length
            }
        }
    )

    result = response.json()

    # If model is loading
    if isinstance(result, dict) and "error" in result:
        return "Model is loading. Please try again in a few seconds."

    if isinstance(result, list):
        return result[0]["generated_text"]

    return "Unable to generate response."
