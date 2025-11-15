from django.urls import path
from .views import CategoriaListAPIView, ProductoListAPIView, ProductoDetailAPIView

urlpatterns = [
    path('categorias/', CategoriaListAPIView.as_view(), name='categorias-list'),
    path('productos/', ProductoListAPIView.as_view(), name='productos-list'),
    path('productos/<int:pk>/', ProductoDetailAPIView.as_view(), name='producto-detail'),
]
