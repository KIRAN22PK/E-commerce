from products.models import Product
from django.db.models import Q

def product_search(entities: dict):
    print("ENTITIES AFTER NORMALIZE:", entities)

    qs = Product.objects.all()

    gender = entities.get("gender")
    category = entities.get("category")
    subcategory = entities.get("subcategory")
    price_lt = entities.get("price_lt")
    price_gt = entities.get("price_gt")
    brand = entities.get("brand")

    # 1️⃣ HARD FILTERS
    if gender:
        qs = qs.filter(gender__iexact=gender)

    if category:
        qs = qs.filter(category__iexact=category)

    # 2️⃣ PRICE FILTERS
    if price_lt is not None:
        qs = qs.filter(price__lte=price_lt)

    if price_gt is not None:
        qs = qs.filter(price__gte=price_gt)

    # 3️⃣ BRAND FILTER
    if brand:
        qs = qs.filter(brand__icontains=brand)

    # 4️⃣ SUBCATEGORY (SOFT, NON-BLOCKING)
    if subcategory:
        # try exact match
        exact_qs = qs.filter(subcategory__iexact=subcategory)

        if exact_qs.exists():
            qs = exact_qs
        else:
            # try partial (~50%) match
            half = subcategory[: max(1, len(subcategory) // 2)]
            partial_qs = qs.filter(subcategory__icontains=half)

            if partial_qs.exists():
                qs = partial_qs
            # else: ❌ do NOTHING → keep full category qs

    # ----------------------------
    # 5️⃣ ATTRIBUTES (SOFT FILTERS)
    # ----------------------------
    attributes = entities.get("attributes", {})
    for key, value in attributes.items():
        value = value.lower()
        half_value = value[: max(1, len(value) // 2)]

        attr_qs = qs.filter(
            Q(**{f"attributes__{key}__icontains": value}) |
            Q(**{f"attributes__{key}__icontains": half_value})
        )

        # apply only if it narrows results
        if attr_qs.exists():
            qs = attr_qs

    return qs
