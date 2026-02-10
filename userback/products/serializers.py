from rest_framework import serializers
from products.models import Product,UserCart,UserOrder
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "username",
            "review_text",
            "rating",
            "sentiment",
            "is_verified_buyer",
            "created_at"
        ]
class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "price",
            "image_url",
            "brand",
            "average_rating",
            "total_reviews",
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_total_reviews(self, obj):
        return obj.reviews.count()

class UserCartSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = UserCart
        fields = [
            "product",
            "quantity",
            "category"
        ]

class UserCartWriteSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

    
class UserOrderSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = UserOrder
        fields = [
            "id",
            "product",
            "quantity",
            "price_at_purchase",
            "ordered_at",
            "category",
        ]

    def get_product(self, obj):
        return {
            "id": obj.product.id,
            "name": obj.product.name,
            "image_url": obj.product.image_url,
            "brand": obj.product.brand,
            "price": obj.product.price,
            "description": obj.product.description,
        }


class UserOrderCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

    # def validate_product_id(self, value):
    #     if not Product.objects.filter(id=value).exists():
    #         raise serializers.ValidationError("Product does not exist")
    #     return value