import { Link } from "react-router-dom";
import { useCategories } from "../api/categories";

export default function Categorias() {
  const { data: categorias, isLoading } = useCategories();

  if (isLoading) return <div className="page">Cargando...</div>;

  // 🎀 Descripciones bonitas por categoría
  const getDescription = (nombre) => {
    switch (nombre.toLowerCase()) {
      case "tortas":
        return "🎂 Tortas especiales para celebrar cada momento";
      case "cupcakes":
        return "🧁 Dulces, suaves y perfectos para regalar";
      case "postres fríos":
        return "🍨 Delicias refrescantes para cualquier día";
      case "galletas":
        return "🍪 Crujientes y llenas de sabor casero";
      case "salados":
        return "🥐 Opciones saladas para acompañar cualquier antojo";
      default:
        return "✨ Productos disponibles";
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Categorías</h1>
      <p className="page-subtitle">Explora productos por categoría 🍰</p>

      <div className="category-grid">
        {categorias.map((cat) => (
          <Link
            to={`/categoria/${cat.id}`}
            key={cat.id}
            className="category-card"
          >
            <div className="category-info">
              <span className="category-name">{cat.nombre}</span>
              <span className="category-description">
                {getDescription(cat.nombre)}
              </span>
            </div>
            <span className="category-pill">Ver →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
