import { useParams, useNavigate } from "react-router-dom";
import { useProduct, usePrefetchProduct } from "../api/products";
import { useCart } from "../context/CartContext";

const getImageUrl = (imagen) => {
  if (!imagen) return "";
  if (imagen.startsWith("http")) return imagen;
  return `http://localhost:8000${imagen}`;
};

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: producto, isLoading } = useProduct(id);
  const prefetch = usePrefetchProduct();
  const { addToCart } = useCart();

  // Prefetch al cargar (mejora de rendimiento)
  if (id) prefetch(id);

  if (isLoading) return <p className="page">Cargando...</p>;
  if (!producto) return <p>No encontrado</p>;

  const handleAdd = () => {
    addToCart(producto);
  };

  return (
    <div className="page product-detail">
      <button onClick={() => navigate(-1)} className="btn-volver">
        ⬅ Volver
      </button>

      {producto.imagen && (
        <img src={getImageUrl(producto.imagen)} alt={producto.nombre} />
      )}

      <div className="info">
        <h1>{producto.nombre}</h1>
        <p className="categoria">{producto.categoria.nombre}</p>
        <p className="precio">S/ {producto.precio}</p>
        <p className="stock">Stock disponible: {producto.stock}</p>
        <p>{producto.descripcion}</p>

        <button onClick={handleAdd}>Añadir al carrito 🛒</button>
      </div>
    </div>
  );
}
