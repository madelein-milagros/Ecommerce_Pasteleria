from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ProductoListCreateView,
    ProductoDetailView,
    CategoriaListView,
    CarritoDetailView,
    CarritoAddItemView,
    CarritoItemUpdateDeleteView,
)

urlpatterns = [
    path('productos/', ProductoListCreateView.as_view(), name='producto-list'),
    path('productos/<int:pk>/', ProductoDetailView.as_view(), name='producto-detail'),
    path('categorias/', CategoriaListView.as_view(), name='categoria-list'),

    path('carrito/', CarritoDetailView.as_view(), name='carrito-detail'),
    path('carrito/items/', CarritoAddItemView.as_view(), name='carrito-add-item'),
    path('carrito/items/<int:pk>/', CarritoItemUpdateDeleteView.as_view(), name='carrito-item-update-delete'),

    # AUTH JWT
    path('auth/register/', views.RegisterView.as_view(), name='api_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='api_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='api_token_refresh'),

    # HISTORIAL DE COMPRAS
    path('historial-compras/', views.OrderHistoryView.as_view(), name='historial_compras'),

    # PAGOS STRIPE
    path('payment/create-intent/', views.CreatePaymentIntentView.as_view(), name='create_payment_intent'),
    path('checkout/confirm/', views.CheckoutConfirmView.as_view(), name='checkout_confirm'),
]
