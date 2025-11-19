import { useState } from "react";
import { useProducts, usePrefetchProduct } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useProducts({ search });
  const prefetchProduct = usePrefetchProduct();

  if (isLoading) return <div className="page">Cargando productos...</div>;

  return (
    <div className="page">
      <h1>Todos los productos</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="product-grid">
        {products?.map((p) => (
          <div key={p.id} onMouseEnter={() => prefetchProduct(p.id)}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
