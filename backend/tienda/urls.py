from django.urls import path
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
]
