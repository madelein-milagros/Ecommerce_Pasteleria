import { useCart } from "../context/CartContext";

export default function Carrito() {
  const { items, removeFromCart, clearCart } = useCart();

  const total = items.reduce(
    (acc, item) => acc + Number(item.precio) * item.quantity,
    0
  );

  return (
    <div className="page">
      <h1>Carrito</h1>
      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="cart">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              {item.imagen && (
                <img src={item.imagen} alt={item.nombre} />
              )}
              <div>
                <h3>{item.nombre}</h3>
                <p>Cantidad: {item.quantity}</p>
                <p>Subtotal: S/ {(Number(item.precio) * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)}>Quitar</button>
              </div>
            </div>
          ))}
          <h2>Total: S/ {total.toFixed(2)}</h2>
          <button onClick={clearCart}>Vaciar carrito</button>
          {/* Aún no se realiza compra, solo agregar/quitar */}
        </div>
      )}
    </div>
  );
}
