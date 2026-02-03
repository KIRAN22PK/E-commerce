from unicodedata import category
import requests
from products.models import Product
from .retriever import retrieve_products
from .answer_builder import build_answer
import re
from collections import Counter
from collections import defaultdict
from products.llm.t5_loader import get_t5
def preprocess_query(q):
    q = q.lower()
    q = q.replace(",", "")
    q = q.replace("₹", "")

    # fix missing spaces
    q = re.sub(r"([a-z])(\d)", r"\1 \2", q)
    q = re.sub(r"(\d)([a-z])", r"\1 \2", q)

    return q
tokenizer, model = get_t5()
def parse_amount(val):
    if val.endswith("k"):
        return int(float(val[:-1]) * 1000)
    return int(val)

def extract_price_filters(q):
    price_lt = None
    price_gt = None

    # under / below / less than
    m = re.search(r"(under|below|less than|upto|max)\s*(\d+\s*k|\d+)", q)
    if m:
        price_lt = parse_amount(m.group(2).replace(" ", ""))
        return price_gt, price_lt

    # between X and Y
    m = re.search(r"between\s*(\d+\s*k|\d+)\s*and\s*(\d+\s*k|\d+)", q)
    if m:
        price_gt = parse_amount(m.group(1).replace(" ", ""))
        price_lt = parse_amount(m.group(2).replace(" ", ""))
        return price_gt, price_lt

    # X to Y  ✅ NEW
    m = re.search(r"(\d+\s*k|\d+)\s*to\s*(\d+\s*k|\d+)", q)
    if m:
        price_gt = parse_amount(m.group(1).replace(" ", ""))
        price_lt = parse_amount(m.group(2).replace(" ", ""))
        return price_gt, price_lt
    # above / more than / over
    m=re.search(r"(above|more than|over)\s*(\d+\s*k|\d+)", q)
    if m:
        price_gt = parse_amount(m.group(2).replace(" ", ""))
        return price_gt, price_lt
    return price_gt, price_lt


def get_dominant_subcategory(products, top_n=10):
    """
    Rank-weighted voting for subcategory.
    Higher-ranked products contribute more.
    """
    scores = defaultdict(float)

    for rank, product in enumerate(products[:top_n]):
        weight = 1 / (rank + 1)   # rank-aware weight
        scores[product.subcategory] += weight

    if not scores:
        return None

    return max(scores, key=scores.get)

# CATEGORY_KEYWORDS = {
#     "electronics": ["mobile", "mobiles", "phone", "phones", "smartphone"],
#     "footwear": ["shoe", "shoes", "footwear", "sneaker"],
#     "clothing": ["shirt", "tshirt", "t-shirt", "jeans"]
# }

# def extract_category(query):
#     for category, keywords in CATEGORY_KEYWORDS.items():
#         for kw in keywords:
#             if kw in query:
#                 return category
#     return None


OLLAMA_URL = "http://localhost:11434/api/generate"


def semantic_product_search(query):
    # 1️⃣ Preprocess query
    query = preprocess_query(query)
    ranked_results = retrieve_products(query)
    print("Preprocessed query:", query)
    print("Ranked results:", ranked_results)

    # 2️⃣ Extract price filters
    price_gt, price_lt = extract_price_filters(query)

    # 3️⃣ Retrieve candidate products via embeddings
    product_ids = [r["product_id"] for r in ranked_results]
    print("Retrieved product IDs:", product_ids)
    # products = Product.objects.filter(id__in=product_ids)
    # print("Initial product count:", products)
    # product_map = {p.id: p for p in products}
    # print("Product map", product_map)
    product_map=Product.objects.in_bulk(product_ids)
    products = [product_map[i] for i in product_ids if i in product_map]
    print("Ordered products:", products)
    # category= extract_category(query)
    # if category:
    #     print("Applying category filter:", category)
    #     products = products.filter(category__iexact=category)
    # 4️⃣ Apply price filters ONLY if present
    if price_lt is not None:
        products = [p for p in products if p.price <= price_lt]
    if price_gt is not None:
        products = [p for p in products if p.price >= price_gt]
    print("Post-price-filter product count:", products)
    dominant_subcat = get_dominant_subcategory(products, top_n=10)
    if dominant_subcat:
        products = [p for p in products if p.subcategory == dominant_subcat]

    # if price_lt is not None:
    #     products = [p for p in products if p.price <= price_lt]

    # if price_gt is not None:
    #     products = [p for p in products if p.price >= price_gt]

    # 5️⃣ Build answer from FINAL filtered products
    print("Final product count:", products)
    answer = build_answer(products)
    # prompt = f"""
    #   rewrite the following answer in a friendly and concise tone:

    #   {answer}
    #         """
            
    # inputs = tokenizer(
    # prompt,
    # return_tensors="pt",
    # max_length=512,
    # truncation=True
    #   )

    # outputs = model.generate(
    # inputs["input_ids"],
    # max_length=120,
    # num_beams=4,
    # early_stopping=True
    # )

    # friendly_answer = tokenizer.decode(
    # outputs[0],
    # skip_special_tokens=True
    # )

    # print(friendly_answer)


    print("answer:", answer)

#     prompt = f"""
# You are an e-commerce assistant.
# Answer the user question using ONLY the data below.

# User question:
# {query}

# Data:
# {answer}
# """

#     try:
#         response = requests.post(
#             OLLAMA_URL,
#             json={
#                 "model": "llama3",
#                 "prompt": prompt,
#                 "stream": False
#             },
#             timeout=60
#         )
#         llm_answer = response.json().get("response", "")
#     except requests.RequestException as e:
#         print("Ollama error:", e)
#         llm_answer = "Sorry, I couldn't generate an answer."

    return answer, products
