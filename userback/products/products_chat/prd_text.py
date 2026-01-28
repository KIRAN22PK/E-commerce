def products_to_text(products):
    lines = []
    for p in products[:5]:
        lines.append(
            f"{p.name}, price ₹{p.price}, material {p.material}, color {p.color}"
        )
    return "\n".join(lines)
