from unicodedata import category
import requests
from products.models import Product
from products.symspell.corrector import correct_query
from products.symspell.loader import get_brand_symspell, get_symspell
from .text_builder import product_to_text
from .retriever import retrieve_products
from .answer_builder import build_answer
import re
from collections import Counter
from collections import defaultdict


def preprocess_query(q):
    q = q.lower()
    q = q.replace(",", " ")
    q = q.replace("₹", "")

    # fix missing spaces
    q = re.sub(r"([a-z])(\d)", r"\1 \2", q)
    q = re.sub(r"(\d)([a-z])", r"\1 \2", q)

    return q
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

# OLLAMA_URL = "http://localhost:11434/api/generate"

def semantic_product_search(query):
    # 1️⃣ Light preprocessing (NOT semantic normalization)
    query = preprocess_query(query)
    print("Preprocessed query:", query)
    sym_spell = get_symspell()
    brand_spell = get_brand_symspell()
    query = correct_query(sym_spell, query)
    print("Spell-corrected query:", query)
    query = correct_query(brand_spell, query)
    print("Brand-corrected query:", query)
    # 2️⃣ First-pass embedding search (RAW query)
    ranked_results = retrieve_products(query)
    product_ids = [r["product_id"] for r in ranked_results]

    product_map = Product.objects.in_bulk(product_ids)
    products = [product_map[i] for i in product_ids if i in product_map]
    print("Initial retrieved products:", products)
    if not products:
        return [], "No products found"
    
    # 3️⃣ Extract price filters (but DO NOT apply yet)
    price_gt, price_lt = extract_price_filters(query)
    
    # 4️⃣ Take TOP-K for dominance inference
    TOP_K = 3
    top_k = products[:TOP_K]
    top_1= products[0]
    print("Top-1 product:", top_1)
    print("top-1 brand:", top_1.brand)
    if top_1.brand.lower() in query:
        print("if")
        refined_products = Product.objects.filter(brand=top_1.brand)
        if price_lt is not None:
         refined_products = [p for p in refined_products if p.price <= price_lt]
        if price_gt is not None:
         refined_products = [p for p in refined_products if p.price >= price_gt]
        answer = build_answer(refined_products)
        return refined_products, answer
    else:
       print("else")
       refined_products = Product.objects.filter(subcategory=top_1.subcategory)
       print("Products after subcategory filter:", refined_products)
       answer = build_answer(refined_products)
       return refined_products, answer
#     print("Top-K products for dominance inference:", top_k)

#     # subcat2_list = [p.subcategory2 for p in top_k if p.subcategory2]
#     subcat1_list1 = [p.subcategory1 for p in top_k if p.subcategory1]

#     # 5️⃣ Dominant-or-first logic
#     def dominant_or_first(values):
#         if not values:
#             return None
#         for v in values:
#             if values.count(v) > 1:
#                 return v
#         return values[0]

#     # chosen_subcat2 = dominant_or_first(subcat2_list)
#     chosen_subcat1 = dominant_or_first(subcat1_list1)
#     # print("Chosen subcategory2:", chosen_subcat2)
#     print("Chosen subcategory1:", chosen_subcat1)
#     # 6️⃣ Find anchor product
#     def get_anchor(products, level, value):
#         for p in products:
#             # if level == "subcategory2" and p.subcategory2 == value:
#             #     return p
#             if level == "subcategory1" and p.subcategory1 == value:
#                 return p
#         return products[0]

#     # if chosen_subcat2:
#     #     anchor = get_anchor(products, "subcategory2", chosen_subcat2)
#     #     print("Anchor found using subcategory2",anchor)
#     if chosen_subcat1:
#         anchor = get_anchor(products, "subcategory1", chosen_subcat1)
#         print("Anchor found using subcategory1",anchor)
#     else:
#         anchor = products[0]
#         print("Anchor defaulted to first product",anchor)
#     # anchor_category = anchor.category
#     anchor_subcategory = anchor.subcategory
#     anchor_subcat1 = anchor.subcategory1
#     # 7️⃣ Re-embed using ANCHOR TEXT (THIS IS THE KEY)
#     anchor_text = product_to_text(anchor)
#     print("Anchor product for re-embedding:", anchor)
#     refined_ranked = retrieve_products(anchor_text)
#     print("Refined ranked results:", refined_ranked)
#     refined_ids = [r["product_id"] for r in refined_ranked]
#     refined_map = Product.objects.in_bulk(refined_ids)
#     refined_products = [
#         refined_map[i] for i in refined_ids if i in refined_map
#     ]

#     # 8️⃣ NOW apply price filter (LAST)
#     if price_lt is not None:
#         refined_products = [p for p in refined_products if p.price <= price_lt]
#     if price_gt is not None:
#         refined_products = [p for p in refined_products if p.price >= price_gt]

#     # 9️⃣ Fallback if price killed everything
#     if not refined_products and anchor_subcat1:
#         refined_products = [
#         p for p in products
#         if p.subcategory1 == anchor_subcat1
#         ]

#     if not refined_products and anchor_subcategory:
#         refined_products = [
#             p for p in products
#             if p.subcategory == anchor_subcategory
#         ]
#     # if not refined_products:
#     #     refined_products = [
#     #     p for p in products
#     #     if p.category == anchor_category
#     #    ]
#   # fallback to embedding results
#     else:
#         refined_products = [
#         p for p in refined_products
#         if p.subcategory == anchor_subcategory
#         ]
        
#     answer = build_answer(refined_products)
#     print("ANSWER:", answer)
# #     prompt = f"""
# # answer question based on data:

# # question:
# # {query}

# # data:
# # {answer}

# # final answer:
# #     """
# #     print("🚀 ENTERING T5 GENERATION 🚀")
# #     inputs = tokenizer(
# #     prompt,
# #     return_tensors="pt",
# #     max_length=512,
# #     truncation=True
# #       )

# #     outputs = model.generate(
# #     inputs["input_ids"],
# #     max_length=120,
# #     num_beams=4,
# #     early_stopping=True
# #      )

# #     decoded = tokenizer.decode(
# #       outputs[0],
# #       skip_special_tokens=True
# #      )

# #     print("🧪 RAW T5 OUTPUT:", repr(decoded), type(decoded))

# #     friendly_answer = decoded

# #     print("Friendly Answer:", friendly_answer)
#     return refined_products, answer
