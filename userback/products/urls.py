from django.urls import path
from .views import ai_search,get_user_cart,user_cart,clear_user_cart,mens_fullhands,mens_halfhands,buy_products,list_orders,recommend_products
urlpatterns = [
    path("search/", ai_search),
    path('sendcart/',get_user_cart),
    path('receivecart/',user_cart),
    path('clearcart/',clear_user_cart),
    path('mens-fullhands/', mens_fullhands),
    path('mens-halfhands/', mens_halfhands),
    path('buy/', buy_products),
    path('list/', list_orders),
    path("recommendations/", recommend_products),
]