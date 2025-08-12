from django.urls import path
from .views import stock_news_api

urlpatterns = [
    path('stock-news/', stock_news_api),
]