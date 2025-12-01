import { useNavigate } from "react-router-dom";
import {
  useCart,
  useUpdateCartItem,
  useDeleteCartItem,
} from "../api/cart";

export default function Carrito() {
  const navigate = useNavigate();

  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const deleteItem = useDeleteCartItem();

  if (isLoading) return <div className="page">Cargando carrito...</div>;

  const items = cart?.items ?? [];

  const handleChange = (item, cantidad) => {
    updateItem.mutate({ itemId: item.id, cantidad });
  };

  const handleRemove = (id) => {
    deleteItem.mutate({ itemId: id });
  };

  return (
    <div className="page">
      <h1>Carrito 🛒</h1>

      <div className="cart-container">
        {items.map((item) => (
          <div className="cart-card" key={item.id}>
            <img
              src={`http://localhost:8000${item.producto.imagen}`}
              alt={item.producto.nombre}
            />

            <div>
              <h3>{item.producto.nombre}</h3>
              <p>Precio: S/ {item.producto.precio}</p>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => handleChange(item, Math.max(1, item.cantidad - 1))}
                >
                  -
                </button>

                <span>{item.cantidad}</span>

                <button
                  onClick={() => handleChange(item, item.cantidad + 1)}
                >
                  +
                </button>
              </div>

              <p>Subtotal: S/ {item.subtotal}</p>

              <button className="btn-pastel" onClick={() => handleRemove(item.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>Total: S/ {cart.total}</h2>

      {/* BOTÓN IR AL CHECKOUT */}
      <button
        className="btn-pastel"
        style={{ marginTop: "20px", fontSize: "1.1rem" }}
        onClick={() => navigate("/checkout")}
      >
        🧁 Finalizar compra
      </button>
    </div>
  );
}
