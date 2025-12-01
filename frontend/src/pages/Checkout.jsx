import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");

  const fetchCarrito = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/carrito/");
      setCart(res.data);
    } catch (error) {
      toast.error("Error cargando carrito 😱");
    }
  };

  const pagar = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Debes iniciar sesión ❤️");

      // 1️⃣ Crear Intent
      const intent = await axios.post(
        "http://localhost:8000/api/payment/create-intent/",
        { amount: Math.round(cart.total * 100) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payment_id = intent.data.clientSecret;

      // 2️⃣ Preparar pedidos (items)
      const items = cart.items.map((item) => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio: item.producto.precio,
      }));

      // 3️⃣ Confirmar la orden
      await axios.post(
        "http://localhost:8000/api/checkout/confirm/",
        {
          items,
          total: cart.total,
          payment_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Compra realizada con éxito 🎀🥳");
    } catch (error) {
      toast.error("Error al procesar el pago 😭");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCarrito();
  }, []);

  if (!cart) return <p>Cargando carrito...</p>;

  return (
    <div className="page">
      <h1>🍰 Checkout</h1>

      <div className="card pastel-card">
        <h2>Total a pagar: S/ {cart.total}</h2>

        <p>Ingrese tarjeta (modo laboratorio)</p>

        <input
          placeholder="5412 7512 3456 7890"
          value={card}
          onChange={(e) => setCard(e.target.value)}
        />

        <input
          placeholder="12/26"
          value={exp}
          onChange={(e) => setExp(e.target.value)}
        />

        <button className="btn-pastel" onClick={pagar}>
          💖 Pagar ahora
        </button>
      </div>
    </div>
  );
}
