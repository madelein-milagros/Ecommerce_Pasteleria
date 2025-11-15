import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/productos/${id}/`)
      .then((res) => setProducto(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="page product-detail">
      {producto.imagen && (
        <img src={producto.imagen} alt={producto.nombre} />
      )}
      <div className="info">
        <h1>{producto.nombre}</h1>
        <p className="categoria">{producto.categoria.nombre}</p>
        <p className="precio">S/ {producto.precio}</p>
        <p className="stock">Stock disponible: {producto.stock}</p>
        <p>{producto.descripcion}</p>
        <button onClick={() => addToCart(producto)}>Añadir al carrito</button>
      </div>
    </div>
  );
}
