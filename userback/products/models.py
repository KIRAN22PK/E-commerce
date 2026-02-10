from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg
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
    subcategory1 = models.CharField(max_length=100,default="",blank=True)
    subcategory2 = models.CharField(max_length=100,default="",blank=True)
    brand = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField()
    likes_count = models.IntegerField(default=0)
    sold_count = models.IntegerField(default=0)
    attributes = models.JSONField(default=dict)

    def __str__(self):
        return self.name
    def average_rating(self):
        avg = self.reviews.aggregate(
        Avg("rating")
       )["rating__avg"]

        if avg is None:
          return 0

        return round(avg, 1)
class Review(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    review_text = models.TextField()
    
   
    sentiment = models.CharField(
        max_length=20,
        choices=[
            ("positive", "Positive"),
            ("neutral", "Neutral"),
            ("negative", "Negative"),
        ]
    )
    rating = models.IntegerField()  

    is_verified_buyer = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("product", "user")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} → {self.product.name} ({self.rating}⭐)"

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
