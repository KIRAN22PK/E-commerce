def product_to_text(product):
    attrs = ", ".join(
        f"{k}: {v}" for k, v in product.attributes.items()
    ) if product.attributes else "None"

    price_hint = "budget" if product.price < 1000 else "premium"

    return f"""
    Product Name: {product.name}
    Brand: {product.brand}
    Category: {product.category}
    Subcategory: {product.subcategory}
    Subcategory1: {product.subcategory1}
    Subcategory2: {product.subcategory2}
    Gender: {product.gender}
    Description: {product.description}
    Attributes: {attrs}
    Price Range: {price_hint}
    Popularity: {product.likes_count} likes
    """
