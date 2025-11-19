import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAddToCart } from "../api/cart";

const getImageUrl = (imagen) => {
  if (!imagen) return "";
  if (imagen.startsWith("http")) return imagen;
  return `http://localhost:8000${imagen}`;
};

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const addToCart = useAddToCart();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/productos/${id}/`)
      .then((res) => setProducto(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAdd = () => {
    if (!producto) return;
    addToCart.mutate(
      { producto_id: producto.id, cantidad: 1 },
      {
        onSuccess: () => {
          toast.success("Producto agregado al carrito 🎉");
        },
        onError: () => {
          toast.error("Error al agregar al carrito 😢");
        },
      }
    );
  };

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="page product-detail">

      {/* BOTÓN VOLVER */}
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
