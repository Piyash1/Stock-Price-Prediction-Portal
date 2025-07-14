from django.urls import path
from accounts import views as Userviews
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import stock_plot_api

urlpatterns = [
    path('register/', Userviews.Register_view.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('stock-plots/', stock_plot_api),
]
