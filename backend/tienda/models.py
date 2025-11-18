from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    # marketing
    en_promocion = models.BooleanField(default=False)
    porcentaje_descuento = models.PositiveIntegerField(default=0)  # 0–100
    es_recomendado = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre

    @property
    def precio_final(self):
        if self.en_promocion and self.porcentaje_descuento > 0:
            return self.precio * (1 - self.porcentaje_descuento / 100)
        return self.precio


class Carrito(models.Model):
    """Carrito simple (para el laboratorio asumimos 1 carrito por usuario/cliente)."""
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Carrito #{self.id}"

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())


class ItemCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('carrito', 'producto')

    def __str__(self):
        return f"{self.producto.nombre} x {self.cantidad}"

    @property
    def subtotal(self):
        return self.producto.precio_final * self.cantidad
