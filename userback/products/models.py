from django.db import models
from django.contrib.auth.models import User
class Product(models.Model):
    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("unisex", "Unisex"),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    image_url = models.URLField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    category = models.CharField(max_length=100)
    subcategory = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField()
    likes_count = models.IntegerField(default=0)
    sold_count = models.IntegerField(default=0)
    attributes = models.JSONField(default=dict)

    def __str__(self):
        return self.name

class ProductLiked(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")

    def __str__(self):
        return f"{self.user.username} liked {self.product.name}"

class UserCart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=100, default="clothing")
    class Meta:
        unique_together = ("user", "product")

    def __str__(self):
        return f"{self.user.username} cart → {self.product.name}"

class UserOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.FloatField()
    ordered_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=100, default="clothing")
    
    def __str__(self):
        return f"{self.user.username} bought {self.product.name}"
