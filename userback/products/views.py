from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from products.models import Review, UserCart,Product,UserOrder,Review
from products.serializers import ProductSerializer,UserCartWriteSerializer,UserCartSerializer,UserOrderSerializer,UserOrderCreateSerializer,ReviewSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from .ml.predict import predict_sentiment, sentiment_to_stars
from django.db.models import Avg

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def user_cart(request):
    serializer = UserCartWriteSerializer(data=request.data, many=True)
    serializer.is_valid(raise_exception=True)

    cart_data = serializer.validated_data

    UserCart.objects.filter(user=request.user).delete()

    cart_objects = []

    for item in cart_data:
        product = get_object_or_404(Product, id=item["product_id"])
        cart_objects.append(
            UserCart(
                user=request.user,
                product=product,
                quantity=item["quantity"],
                category=product.category,
            )
        )

    UserCart.objects.bulk_create(cart_objects)

    return Response({"message": "Cart synced"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_cart(request):
    print("Fetching cart for user:", request.user)
    cart_items = UserCart.objects.filter(user=request.user).select_related("product")

    serializer = UserCartSerializer(cart_items, many=True)

    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def clear_user_cart(request):
    UserCart.objects.filter(user=request.user).delete()
    return Response({"message": "Cart cleared"})


@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def mens_fullhands(request):
    products = Product.objects.filter(
        gender="male",
        category="clothing",
        subcategory="shirts",
        subcategory1="full sleeve",
    )

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def mens_halfhands(request):
    products = Product.objects.filter(
        gender="male",
        category="clothing",
        subcategory="shirts",
        subcategory1="half sleeve"
    )

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def shoes(request):
    products = Product.objects.filter(
        gender="male",
        category="footwear",
        subcategory="shoe",
    )
    print(products)

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def fans(request):
    products = Product.objects.filter(
        category="electronics",
        subcategory="fan",
    )
    print(products)

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def bulbs(request):
    products = Product.objects.filter(
        category="electronics",
        subcategory="light",
    )
    print(products)

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def mobiles(request):
    products = Product.objects.filter(
        category="electronics",
        subcategory="mobiles",
    )
    print(products)

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def buy_products(request):
    serializer = UserOrderCreateSerializer(data=request.data, many=True)

    serializer.is_valid(raise_exception=True)

    created_orders = []

    for item in serializer.validated_data:
        product = Product.objects.get(id=item["product_id"])
        quantity = item["quantity"]

        order, created = UserOrder.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={
                "quantity": quantity,
                "price_at_purchase": product.price,
                "category": product.category,
            }
        )

        if not created:
           order.quantity = quantity
           order.save()

        created_orders.append(order.id)

    return Response(
        {
            "message": "Orders placed successfully",
            "order_ids": created_orders
        },
        status=status.HTTP_201_CREATED
    )



@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def list_orders(request):
    orders = UserOrder.objects.filter(user=request.user).order_by("-ordered_at")
    serializer = UserOrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recommend_products(request):
    from .recommender.model_loader import load_model
    user = request.user

    interactions = set(
        list(UserOrder.objects.filter(user=user).values_list("product_id", flat=True)) +
        list(UserCart.objects.filter(user=user).values_list("product_id", flat=True))
    )

    # Cold start
    if not interactions:
        products = Product.objects.order_by("-id")[:10]
        return Response(ProductSerializer(products, many=True).data)

    model = load_model()
    similarity = model["similarity"]
    product_ids = model["product_ids"]

    scores = {}

    for pid in interactions:
        if pid not in product_ids:
            continue

        idx = product_ids.index(pid)
        for i, score in enumerate(similarity[idx]):
            scores[product_ids[i]] = scores.get(product_ids[i], 0) + score

    for pid in interactions:
        scores.pop(pid, None)

    recommended_ids = sorted(scores, key=scores.get, reverse=True)[:10]

    if not recommended_ids:
        products = Product.objects.exclude(id__in=interactions)[:10]
    else:
        products = Product.objects.filter(id__in=recommended_ids)

    return Response(ProductSerializer(products, many=True).data)

@api_view(["POST"])
def semantic_search(request):
    from .embedding_chat.pipeline import semantic_product_search
    query = request.data.get("query", "")
    products,answer= semantic_product_search(query)
    if not isinstance(answer, str):
      answer = "Sorry, I couldn’t find suitable products for your request."
    serializer = ProductSerializer(products, many=True)
    return Response({
        "answer": answer,
        "products": 
            # {
            #     "id": p.id,
            #     "name": p.name,
            #     "price": p.price,
            #     "image": p.image_url
            # } for p in products
            serializer.data
        
    })
    
def format_attributes(attrs):
    if not attrs:
        return "No structured attributes provided."

    lines = []
    for k, v in attrs.items():
        if isinstance(v, list):
            v = ", ".join(v)
        lines.append(f"{k.replace('_', ' ').title()}: {v}")
    return "\n".join(lines)


# from .llm import generate_comparison_answer
@api_view(["POST"])
# @permission_classes([IsAuthenticated])
def compare_products(request):
    from .t5llm.t5answer import generate_answer_t5
    query = request.data.get("query")
    product1_id = request.data.get("product1_id")
    product2_id = request.data.get("product2_id")

    if not query or not product1_id or not product2_id:
        return Response(
            {"error": "query, product1_id, and product2_id are required"},
            status=400
        )

    try:
        p1 = Product.objects.get(id=product1_id)
        p2 = Product.objects.get(id=product2_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    context = f"""
    Product 1:
    {p1.name} by {p1.brand} is priced at ₹{p1.price}. 
    Category: {p1.category} Subcategory: {p1.subcategory}.
    Description: {p1.description}
    Attributes: {format_attributes(p1.attributes)}

    Product 2:
    {p2.name} by {p2.brand} is priced at ₹{p2.price}. 
    Category: {p2.category} Subcategory: {p2.subcategory}.
    Description: {p2.description}
    Attributes: {format_attributes(p2.attributes)}
    """

    # answer = generate_comparison_answer(context, query)
    answer = generate_answer_t5(context, query)
    print("Generated comparison answer:", answer)
    return Response({
        "answer": answer
    })
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_review(request, product_id):
    from .ml.predict import predict_sentiment, sentiment_to_stars
    user = request.user

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    review_text = request.data.get("review_text", "").strip()

    if not review_text:
        return Response(
            {"error": "Review text is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    has_bought =UserOrder.objects.filter(
        user=user,
        product=product,
    ).exists()

    if not has_bought:
        return Response(
            {"error": "You must buy this product to review it"},
            status=status.HTTP_403_FORBIDDEN
        )

    if Review.objects.filter(user=user, product=product).exists():
        return Response(
            {"error": "You have already reviewed this product"},
            status=status.HTTP_400_BAD_REQUEST
        )

    sentiment = predict_sentiment(review_text)
    rating = sentiment_to_stars(sentiment)

    Review.objects.create(
        user=user,
        product=product,
        review_text=review_text,
        sentiment=sentiment,
        rating=rating,
        is_verified_buyer=True
    )

    return Response(
        {"message": "Review submitted successfully"},
        status=status.HTTP_201_CREATED
    )
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def product_reviews(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=404
        )

    reviews_qs = Review.objects.select_related("user").filter(
        product=product
    )

    reviews_data = []
    for r in reviews_qs:
        reviews_data.append({
            "id": r.id,
            "username": r.user.username,
            "review_text": r.review_text,
            "rating": r.rating,
            "sentiment": r.sentiment,
            "is_verified_buyer": r.is_verified_buyer,
            "created_at": r.created_at
        })

    avg_rating = reviews_qs.aggregate(
        Avg("rating")
    )["rating__avg"]

    return Response({
        "avg_rating": round(avg_rating, 1) if avg_rating else 0,
        "total_reviews": reviews_qs.count(),
        "reviews": reviews_data
    })