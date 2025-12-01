import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Historial() {
  const [orders, setOrders] = useState([]);

  const fetchHistorial = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8000/api/historial-compras/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (error) {
      toast.error("No se pudo obtener el historial 😢");
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  return (
    <div className="page">
      <h1>📦 Historial de Compras</h1>

      {orders.length === 0 ? (
        <p>No tienes compras registradas aún.</p>
      ) : (
        <div className="historial-list">
          {orders.map((order) => (
            <div key={order.id} className="card pastel-card">
              <h3>Orden #{order.id}</h3>
              <p>Fecha: {new Date(order.created_at).toLocaleString()}</p>
              <p>Total: S/ {order.total}</p>

              <h4>Productos:</h4>
              {order.items.map((item) => (
                <div key={item.id} className="item">
                  <img
                    src={`http://localhost:8000${item.product.imagen}`}
                    alt={item.product.nombre}
                    className="img-small"
                  />
                  <p>
                    {item.product.nombre} × {item.quantity} — S/ {item.price}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
