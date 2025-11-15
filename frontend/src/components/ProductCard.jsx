import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      {product.imagen && (
        <img src={product.imagen} alt={product.nombre} />
      )}
      <h3>{product.nombre}</h3>
      <p className="categoria">{product.categoria.nombre}</p>
      <p className="precio">S/ {product.precio}</p>
      <div className="actions">
        <button onClick={() => addToCart(product)}>Añadir</button>
        <Link to={`/producto/${product.id}`}>Detalle</Link>
      </div>
    </div>
  );
}
