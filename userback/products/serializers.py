from rest_framework import serializers
from products.models import Product,UserCart,UserOrder

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

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
        }


class UserOrderCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value).exists():
            raise serializers.ValidationError("Product does not exist")
        return value