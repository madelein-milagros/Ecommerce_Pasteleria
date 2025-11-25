import { useLocation } from "react-router-dom";
import { useProducts, usePrefetchProduct } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  // ⭐ Leemos el parámetro "search" del navbar
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";

  const { data: products, isLoading } = useProducts({ search });
  const prefetchProduct = usePrefetchProduct();

  if (isLoading) return <div className="page">Cargando productos...</div>;

  return (
    <div className="page">

      {/* ⭐ HERO SECTION DIRECTAMENTE EN HOME ⭐ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4rem 2rem",
          background: "#fbeaf2ff",
          borderRadius: "0 0 40px 40px",
          boxShadow: "0 4px 18px rgba(255,150,200,0.15)",
          marginBottom: "3rem",
        }}
      >
        {/* IZQUIERDA */}
        <div style={{ flex: 1, paddingRight: "2rem" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", color: "#64104cff", lineHeight: "1.2" }}>
            Deliciosos Pasteles<br />Para Todos
          </h1>

          <p style={{ fontSize: "1.1rem", color: "#642c56ff", marginTop: "1rem", maxWidth: "420px" }}>
            Endulza cada momento especial con tortas, postres y delicias hechas con amor. 🎂✨
          </p>

          <a
            href="/categorias"
            style={{
              display: "inline-block",
              padding: "0.9rem 2rem",
              marginTop: "1.5rem",
              background: "linear-gradient(135deg,#ff66b3,#ff8ccf)",
              color: "white",
              fontSize: "1.1rem",
              borderRadius: "50px",
              textDecoration: "none",
              transition: ".3s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Explorar Categorias 🍰
          </a>
        </div>

        {/* DERECHA */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "420px",
              height: "420px",
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(255,150,200,0.3)",
            }}
          >
            <img
              src="/cake-main.webp"
              alt="Pastel"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
      {/* FIN HERO SECTION */}


      {/* 🔍 TÍTULO */}
      <h1>Todos los productos</h1>

      {/* ❗ YA NO HAY INPUT AQUÍ — EL BUSCADOR AHORA VIVE EN EL NAVBAR */}
      {/* ❗ EL HOME SOLO LEE EL SEARCH DESDE LA URL */}

      {/* 🧁 GRID DE PRODUCTOS */}
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
