import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

export default function CheckoutForm({ cart, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // 1️⃣ Confirmar el pago con Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/historial`,
        },
        redirect: "if_required", // No redirigir automáticamente
      });

      if (error) {
        toast.error(error.message || "Error al procesar el pago");
        setIsProcessing(false);
        return;
      }

      // 2️⃣ Si el pago fue exitoso, guardar la orden en el backend
      if (paymentIntent.status === "succeeded") {
        await onSuccess(paymentIntent.id);
        toast.success("¡Pago exitoso! 🎉");
      }
    } catch (err) {
      toast.error("Error inesperado al procesar el pago");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <h3>Método de pago</h3>
      
      {/* 💳 Stripe Payment Element - Incluye: tarjeta, Google Pay, Apple Pay automáticamente */}
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn-pastel"
        style={{
          marginTop: "1.5rem",
          width: "100%",
          fontSize: "1.1rem",
          opacity: isProcessing ? 0.6 : 1,
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
      >
        {isProcessing ? "Procesando..." : `💖 Pagar S/ ${cart.total}`}
      </button>
    </form>
  );
}