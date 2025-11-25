import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const getImageUrl = (imagen) => {
  if (!imagen) return "";
  if (imagen.startsWith("http")) return imagen;
  return `http://localhost:8000${imagen}`;
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, {
      onSuccess: () => toast.success("Agregado 🎉"),
      onError: (err) => {
        const msg =
          err?.response?.data?.detail || "No se pudo agregar al carrito";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="product-card">
      {product.imagen && (
        <img src={getImageUrl(product.imagen)} alt={product.nombre} />
      )}
      <h3>{product.nombre}</h3>
      <p className="categoria">{product.categoria.nombre}</p>
      <p className="precio">S/ {product.precio}</p>
      <div className="actions">
        <button onClick={handleAdd}>Añadir</button>
        <Link to={`/producto/${product.id}`}>Detalle</Link>
      </div>
    </div>
  );
}
