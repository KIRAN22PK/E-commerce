def build_answer(products):
    if not products:
        return "No products found."

    lines = ["Here are some products you may like:\n"]

    for p in products:
        lines.append(
            f"- {p.name} ({p.brand}) – ₹{p.price}"
        )

    return "\n".join(lines)   # ✅ STRING
