import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  // Cuando cambie la URL, actualizar el input
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    navigate(`/?search=${e.target.value}`);
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <Link to="/">Pastelería</Link>
        <Link to="/categorias">Categorías</Link>
      </div>

      <input
        type="text"
        className="navbar-search"
        placeholder="Buscar productos..."
        value={search}
        onChange={handleSearch}
      />

      <div className="nav-right">
        <Link to="/carrito" className="carrito-link">🛒 Carrito</Link>
      </div>
    </div>
  );
}
