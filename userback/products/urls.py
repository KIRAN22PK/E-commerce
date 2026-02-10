from django.urls import path
from .views import compare_products, get_user_cart, semantic_search,user_cart,clear_user_cart,mens_fullhands,mens_halfhands,buy_products,list_orders,recommend_products,product_reviews,add_review,shoes,fans,bulbs,mobiles
urlpatterns = [
    path('sendcart/',get_user_cart),
    path('receivecart/',user_cart),
    path('clearcart/',clear_user_cart),
    path('mens-fullhands/', mens_fullhands),
    path('mens-halfhands/', mens_halfhands),
    path('mens-footwear/', shoes),
    path('fans/', fans),
    path('bulbs/', bulbs),
    path('shoes/', shoes),
    path('mobiles/', mobiles),
    path('buy/', buy_products),
    path('list/', list_orders),
    path("recommendations/", recommend_products),
    path('semantic-search/',semantic_search),
    path('compare/',compare_products),
    path('<int:product_id>/reviews/',product_reviews ),
    path('<int:product_id>/add-review/',add_review ),

]