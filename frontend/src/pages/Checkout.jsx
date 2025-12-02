import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import CheckoutForm from "../components/CheckoutForm";

// 🔑 IMPORTANTE: Reemplaza con tu STRIPE_PUBLISHABLE_KEY
// La obtienes en: https://dashboard.stripe.com/test/apikeys
// Puedes usar la clave de prueba para desarrollo
export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  // 📦 Cargar carrito y crear PaymentIntent
  useEffect(() => {
    const initCheckout = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Debes iniciar sesión para continuar 💕");
          navigate("/login");
          return;
        }

        // 1️⃣ Obtener carrito
        const cartRes = await axios.get("http://localhost:8000/api/carrito/");
        const cartData = cartRes.data;

        if (!cartData.items || cartData.items.length === 0) {
          toast.error("Tu carrito está vacío");
          navigate("/carrito");
          return;
        }

        setCart(cartData);

        // 2️⃣ Crear PaymentIntent en el backend
        const intentRes = await axios.post(
          "http://localhost:8000/api/payment/create-intent/",
          { amount: Math.round(cartData.total * 100) }, // Convertir a céntimos
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClientSecret(intentRes.data.clientSecret);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar el checkout");
        navigate("/carrito");
      } finally {
        setLoading(false);
      }
    };

    initCheckout();
  }, [navigate]);

  // 💾 Confirmar orden después del pago exitoso
  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const token = localStorage.getItem("token");

      const items = cart.items.map((item) => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio: item.producto.precio,
      }));

      await axios.post(
        "http://localhost:8000/api/checkout/confirm/",
        {
          items,
          total: cart.total,
          payment_id: paymentIntentId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirigir al historial
      setTimeout(() => {
        navigate("/historial");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la orden");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Cargando checkout...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="page">
        <p>Error al cargar el pago</p>
      </div>
    );
  }

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#ff66b3",
      colorBackground: "#ffffff",
      colorText: "#4a0044",
      borderRadius: "12px",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="page">
      <h1>🍰 Checkout</h1>

      <div className="checkout-container">
        {/* 📋 Resumen del pedido */}
        <div className="order-summary">
          <h2>Resumen de tu pedido</h2>

          {cart.items.map((item) => (
            <div key={item.id} className="summary-item">
              <img
                src={`http://localhost:8000${item.producto.imagen}`}
                alt={item.producto.nombre}
                style={{ width: "60px", borderRadius: "8px" }}
              />
              <div>
                <p>
                  <strong>{item.producto.nombre}</strong>
                </p>
                <p>Cantidad: {item.cantidad}</p>
              </div>
              <p>
                <strong>S/ {item.subtotal}</strong>
              </p>
            </div>
          ))}

          <div className="total">
            <h3>Total: S/ {cart.total}</h3>
          </div>
        </div>

        {/* 💳 Formulario de pago con Stripe */}
        <div className="payment-section">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm cart={cart} onSuccess={handlePaymentSuccess} />
          </Elements>
        </div>
      </div>
    </div>
  );
}