from django.db.models import Q
from django.conf import settings
from django.contrib.auth.models import User

import stripe

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Categoria,
    Producto,
    Carrito,
    ItemCarrito,
    Order,
    OrderItem,
)
from .serializers import (
    CategoriaSerializer,
    ProductoSerializer,
    CarritoSerializer,
    ItemCarritoSerializer,
    RegisterSerializer,
    OrderSerializer,
)

# Configurar Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


# ==========================
#   PRODUCTOS Y CATEGORÍAS
# ==========================

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


# ==========================
#          CARRITO
# ==========================

def get_default_cart():
    """
    Para el laboratorio asumimos 1 carrito 'global' con id=1.
    En un proyecto real, iría ligado al usuario.
    """
    carrito, created = Carrito.objects.get_or_create(id=1)
    return carrito


class CarritoDetailView(APIView):
    """
    GET /api/carrito/ -> contenido del carrito
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        carrito = get_default_cart()
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)


class CarritoAddItemView(APIView):
    """
    POST /api/carrito/items/
    body: { "producto_id": 1, "cantidad": 2 }
    """
    permission_classes = [permissions.AllowAny]

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
    permission_classes = [permissions.AllowAny]

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


# ==========================
#        AUTENTICACIÓN
# ==========================

class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    {
      "username": "milagros",
      "email": "m@example.com",
      "password": "123456"
    }
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ==========================
#    HISTORIAL DE COMPRAS
# ==========================

class OrderHistoryView(generics.ListAPIView):
    """
    GET /api/historial-compras/
    (requiere usuario autenticado)
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


# ==========================
#    PAGOS CON STRIPE
# ==========================

class CreatePaymentIntentView(APIView):
    """
    POST /api/payment/create-intent/
    body: { "amount": 6000 }  # S/ 60.00 en céntimos
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')

        if not amount:
            return Response({"detail": "Falta el monto"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount),
                currency="pen",  # o "usd"
                metadata={"user_id": request.user.id}
            )
            return Response({"clientSecret": intent['client_secret']})
        except Exception as e:
            return Response(
                {"detail": f"Error al crear PaymentIntent: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


class CheckoutConfirmView(APIView):
    """
    POST /api/checkout/confirm/
    {
      "items": [
        { "producto_id": 1, "cantidad": 2, "precio": "15.00" },
        { "producto_id": 5, "cantidad": 1, "precio": "30.00" }
      ],
      "total": "60.00",
      "payment_id": "pi_XXX"
    }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        items = data.get('items', [])
        total = data.get('total')
        payment_id = data.get('payment_id')

        if not items:
            return Response({"detail": "No se enviaron items"}, status=status.HTTP_400_BAD_REQUEST)
        if total is None:
            return Response({"detail": "Falta el total"}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la orden
        order = Order.objects.create(
            user=request.user,
            total=total,
            payment_id=payment_id,
            status='paid'
        )

        # Crear items asociados
        for item in items:
            try:
                producto = Producto.objects.get(id=item['producto_id'])
            except Producto.DoesNotExist:
                continue  # podrías manejar error distinto

            cantidad = int(item['cantidad'])
            precio = item.get('precio', producto.precio)

            OrderItem.objects.create(
                order=order,
                product=producto,
                quantity=cantidad,
                price=precio
            )

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
