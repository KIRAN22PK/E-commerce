from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from products.services.normalize1 import normalize_entities
from products.models import UserCart,Product,UserOrder
from products.services.aiintent import extract_intent
from products.services.productsearch import product_search
from products.serializers import ProductSerializer,UserCartWriteSerializer,UserCartSerializer,UserOrderSerializer,UserOrderCreateSerializer
from django.shortcuts import get_object_or_404
from .products_chat.prd_text import products_to_text
from .products_chat.prd_llm import build_product_chat_prompt
from rest_framework import status
from .recommender.model_loader import load_model

@api_view(["POST"])
def ai_search(request):
    user_input = request.data.get("query")
    if not user_input:
       return Response([], status=200) 
    intent_data = extract_intent(user_input)
    print('intent data', intent_data)
    entities = normalize_entities(intent_data["entities"])
    print('entities', entities)
    products = product_search(intent_data["entities"])
    print('fetched products', products)
    if intent_data["intent"] =='product_search':
       serializer = ProductSerializer(products, many=True)
       print(serializer.data)
       return Response({
        "intent": intent_data["intent"],
        "filters": intent_data["entities"],
        "results": serializer.data
        })
    else:
        product_context = products_to_text(products)
        prompt = build_product_chat_prompt(user_input, product_context)
        return Response({
            "intent": intent_data["intent"],
            "filters": intent_data["entities"],
            "chat_prompt": prompt
        })
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
                quantity=item["quantity"]
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
def mens_fullhands(request):
    products = Product.objects.filter(
        gender="male",
        category="clothing",
        subcategory="full hand",
    )

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def mens_halfhands(request):
    products = Product.objects.filter(
        gender="male",
        category="clothing",
        subcategory="Half hands",
    )

    serializer = ProductSerializer(products, many=True)
    print(serializer.data)
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
            order.quantity += quantity
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

    # Remove already interacted products
    for pid in interactions:
        scores.pop(pid, None)

    recommended_ids = sorted(scores, key=scores.get, reverse=True)[:10]

    if not recommended_ids:
        products = Product.objects.exclude(id__in=interactions)[:10]
    else:
        products = Product.objects.filter(id__in=recommended_ids)

    return Response(ProductSerializer(products, many=True).data)