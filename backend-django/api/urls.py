from django.urls import path
from accounts import views as Userviews
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import stock_plot_api
from accounts.views import ActivateAccountView

urlpatterns = [
    path('register/', Userviews.Register_view.as_view()),
    path('activate/<str:uidb64>/<str:token>/', ActivateAccountView.as_view(), name='activate_account'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('stock-plots/', stock_plot_api),
]
