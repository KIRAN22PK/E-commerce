# products/services/router.py
from products.services.productsearch import product_search

def route_intent(llm_json, user_input):
    intent = llm_json.get("intent")
    entities = llm_json.get("entities", {})

    if intent == "product_search":
        return product_search(entities)

    return None
