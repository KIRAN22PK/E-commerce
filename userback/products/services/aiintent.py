import requests
import json
import re

OLLAMA_URL = "http://localhost:11434/api/generate"

SYSTEM_PROMPT = """
You are an intent extractor for an e-commerce app.

Rules:
- Respond ONLY with valid JSON
- No explanation
- Fix spelling mistakes silently
- user may type wrong spellings understand it and guess gender and other entities and dont use same mis-spelled value for two or more entities
JSON format:
{
  "intent": "product_search | casual_chat",
  "entities": {
    "gender": "",
    "category": "",
    "subcategory": "",
    "price_lt": null,
    "price_gt":null,
    "attributes": {}
  }
}
"""

def safe_json(text):
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON found")
    return json.loads(match.group())

def extract_intent(user_input: str) -> dict:
    if not user_input:
        return {"intent": "casual_chat", "entities": {}}

    prompt = f"""
{SYSTEM_PROMPT}

User query:
{user_input}
"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        ai_text = response.json()["response"]
        return safe_json(ai_text)

    except Exception as e:
        print("❌ OLLAMA ERROR:", e)
        return {"intent": "casual_chat", "entities": {}}
