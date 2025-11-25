import { useParams } from "react-router-dom";
import { useProducts, usePrefetchProduct } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function ProductosPorCategoria() {
  const { id } = useParams();

  // 🔎 Obtener productos filtrados por categoría
  const { data: productos, isLoading } = useProducts({ categoria: id });

  // ⚡ Prefetch del detalle de cada producto
  const prefetchProduct = usePrefetchProduct();

  if (isLoading) return <div className="page">Cargando...</div>;

  return (
    <div className="page">
      <h1>Productos por categoría</h1>

      <div className="product-grid">
        {productos?.map((p) => (
          <div
            key={p.id}
            onMouseEnter={() => prefetchProduct(p.id)}  // ⭐ PREFETCH AQUÍ
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
