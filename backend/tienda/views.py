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

# ==========================
#   CONFIGURACIÓN STRIPE
# ==========================

stripe.api_key = settings.STRIPE_SECRET_KEY


# ==========================
#   PRODUCTOS Y CATEGORÍAS
# ==========================

class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        categoria_id = self.request.query_params.get("categoria")
        search = self.request.query_params.get("search")

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
#            CARRITO
# ==========================

def get_default_cart():
    carrito, created = Carrito.objects.get_or_create(id=1)
    return carrito


class CarritoDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        carrito = get_default_cart()
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)


class CarritoAddItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        carrito = get_default_cart()
        serializer = ItemCarritoSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        producto = serializer.validated_data["producto"]
        cantidad = serializer.validated_data["cantidad"]

        if cantidad < 1:
            return Response({"detail": "La cantidad mínima es 1"}, status=status.HTTP_400_BAD_REQUEST)

        if cantidad > producto.stock:
            return Response({"detail": "No hay stock suficiente"}, status=status.HTTP_400_BAD_REQUEST)

        item, created = ItemCarrito.objects.get_or_create(
            carrito=carrito, producto=producto,
            defaults={"cantidad": cantidad}
        )

        if not created:
            nueva_cantidad = item.cantidad + cantidad
            if nueva_cantidad > producto.stock:
                return Response({"detail": "No hay stock suficiente"}, status=status.HTTP_400_BAD_REQUEST)
            item.cantidad = nueva_cantidad
            item.save()

        return Response(ItemCarritoSerializer(item).data, status=status.HTTP_201_CREATED)


class CarritoItemUpdateDeleteView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, pk):
        carrito = get_default_cart()
        try:
            item = carrito.items.get(pk=pk)
        except ItemCarrito.DoesNotExist:
            return Response({"detail": "Item no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        cantidad = request.data.get("cantidad")
        cantidad = int(cantidad)

        if cantidad < 1:
            return Response({"detail": "La cantidad mínima es 1"}, status=status.HTTP_400_BAD_REQUEST)

        if cantidad > item.producto.stock:
            return Response({"detail": "No hay stock suficiente"}, status=status.HTTP_400_BAD_REQUEST)

        item.cantidad = cantidad
        item.save()
        return Response(ItemCarritoSerializer(item).data)

    def delete(self, request, pk):
        carrito = get_default_cart()
        try:
            item = carrito.items.get(pk=pk)
        except ItemCarrito.DoesNotExist:
            return Response({"detail": "Item no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==========================
#       AUTENTICACIÓN
# ==========================

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ==========================
#     HISTORIAL DE COMPRAS
# ==========================

class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")


# ==========================
#   PAGOS Y CHECKOUT STRIPE
# ==========================

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get("amount")

        if not amount:
            return Response({"detail": "Falta monto"}, status=status.HTTP_400_BAD_REQUEST)

        intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency="pen",
            metadata={"user_id": request.user.id}
        )

        return Response({"clientSecret": intent["client_secret"]})


class CheckoutConfirmView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        print("📩 DATA RECIBIDA EN /checkout/confirm/:", request.data)

        items = request.data.get("items", [])
        total = request.data.get("total")
        payment_id = request.data.get("payment_id")

        if not items:
            return Response({"detail": "No items"}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=request.user,
            total=total,
            payment_id=payment_id,
            status="paid"
        )

        for item in items:
            producto = Producto.objects.get(id=item["producto_id"])
            OrderItem.objects.create(
                order=order,
                product=producto,
                quantity=item["cantidad"],
                price=item.get("precio", producto.precio),
            )
        # 3️⃣ Vaciar el carrito global (id=1)
        carrito = get_default_cart()
        carrito.items.all().delete() 

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
