def normalize_entities(entities: dict) -> dict:
    category_map = {
        "clothes": "clothing",
        "dress": "clothing",
        "dresses": "clothing",
        "shirt": "clothing",
        "shirts": "clothing",
        "apparel": "clothing",
        "tshirt": "clothing",
        "t-shirt": "clothing",
        "tops": "clothing",
        "fans": "electronics",
        "lightbulbs": "electronics",
        "slippers": "footwear",
        "shoes": "footwear",
        "shoe": "footwear",
        "footwears": "footwear",
    }

    gender_map = {
        "feminine": "female",
        "women": "female",
        "woman": "female",
        "females": "female",
        "ladies": "female",
        "men": "male",
        "mens": "male",
    }

    subcategory_map = {
        "full sleeve": "full hand",
        "full sleeves": "full hand",
        "full hand": "full hand",
        "full hands": "full hand",

        "half sleeve": "half hand",
        "half sleeves": "half hand",
        "half hand": "half hand",
        "half hands": "half hand",

        
    }

    # normalize category
    if entities.get("category"):
        entities["category"] = category_map.get(
            entities["category"].lower(),
            entities["category"]
        )

    # normalize gender
    if entities.get("gender"):
        entities["gender"] = gender_map.get(
            entities["gender"].lower(),
            entities["gender"]
        )

    # normalize subcategory
    if entities.get("subcategory"):
        entities["subcategory"] = subcategory_map.get(
            entities["subcategory"].lower(),
            entities["subcategory"]
        )

    return entities
