import { useParams } from "react-router-dom";
import { useProducts } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function ProductosPorCategoria() {
  const { id } = useParams();
  const { data: productos, isLoading } = useProducts({ categoria: id });

  if (isLoading) return <div className="page">Cargando...</div>;

  return (
    <div className="page">
      <h1>Productos por categoría</h1>
      <div className="product-grid">
        {productos.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
