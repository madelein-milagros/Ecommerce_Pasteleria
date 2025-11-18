from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q

from .models import Producto, Categoria, Carrito, ItemCarrito
from .serializers import (
    ProductoSerializer,
    CategoriaSerializer,
    CarritoSerializer,
    ItemCarritoSerializer,
)

# --------- Productos ---------

class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        categoria_id = self.request.query_params.get('categoria')
        search = self.request.query_params.get('search')

        if categoria_id:
            qs = qs.filter(categoria_id=categoria_id)
        if search:
            qs = qs.filter(
                Q(nombre__icontains=search) |
                Q(descripcion__icontains=search)
            )
        return qs


class ProductoDetailView(generics.RetrieveAPIView):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer


class CategoriaListView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


# --------- Carrito ---------

def get_default_cart():
    # para el laboratorio asumimos 1 carrito "por defecto"
    carrito, created = Carrito.objects.get_or_create(id=1)
    return carrito


class CarritoDetailView(APIView):
    """
    GET /api/carrito/ -> contenido del carrito
    """

    def get(self, request):
        carrito = get_default_cart()
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)


class CarritoAddItemView(APIView):
    """
    POST /api/carrito/items/
    body: { "producto_id": 1, "cantidad": 2 }
    """

    def post(self, request):
        carrito = get_default_cart()
        serializer = ItemCarritoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        producto = serializer.validated_data['producto']
        cantidad = serializer.validated_data['cantidad']

        if cantidad < 1:
            return Response({"detail": "La cantidad mínima es 1."},
                            status=status.HTTP_400_BAD_REQUEST)

        if cantidad > producto.stock:
            return Response({"detail": "No hay stock suficiente."},
                            status=status.HTTP_400_BAD_REQUEST)

        item, created = ItemCarrito.objects.get_or_create(
            carrito=carrito, producto=producto,
            defaults={'cantidad': cantidad}
        )
        if not created:
            nueva_cantidad = item.cantidad + cantidad
            if nueva_cantidad > producto.stock:
                return Response({"detail": "No hay stock suficiente."},
                                status=status.HTTP_400_BAD_REQUEST)
            item.cantidad = nueva_cantidad
            item.save()

        return Response(ItemCarritoSerializer(item).data, status=status.HTTP_201_CREATED)


class CarritoItemUpdateDeleteView(APIView):
    """
    PATCH /api/carrito/items/<id>/  body: { "cantidad": 3 }
    DELETE /api/carrito/items/<id>/
    """

    def patch(self, request, pk):
        carrito = get_default_cart()
        try:
            item = carrito.items.get(pk=pk)
        except ItemCarrito.DoesNotExist:
            return Response({"detail": "Item no encontrado."},
                            status=status.HTTP_404_NOT_FOUND)

        nueva_cantidad = request.data.get('cantidad')
        if nueva_cantidad is None:
            return Response({"detail": "Debe enviar cantidad."},
                            status=status.HTTP_400_BAD_REQUEST)

        nueva_cantidad = int(nueva_cantidad)
        if nueva_cantidad < 1:
            return Response({"detail": "La cantidad mínima es 1."},
                            status=status.HTTP_400_BAD_REQUEST)

        if nueva_cantidad > item.producto.stock:
            return Response({"detail": "No hay stock suficiente."},
                            status=status.HTTP_400_BAD_REQUEST)

        item.cantidad = nueva_cantidad
        item.save()
        return Response(ItemCarritoSerializer(item).data)

    def delete(self, request, pk):
        carrito = get_default_cart()
        try:
            item = carrito.items.get(pk=pk)
        except ItemCarrito.DoesNotExist:
            return Response({"detail": "Item no encontrado."},
                            status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
