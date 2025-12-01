import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // Detectar búsqueda en la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    navigate(`/?search=${e.target.value}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
        <Link to="/carrito">🛒 Carrito</Link>

        {/* Si NO hay sesión → mostrar Login y Register */}
        {!token && (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}

        {/* Si hay sesión → mostrar historial + logout */}
        {token && (
          <>
            <Link to="/historial">📜 Historial</Link>
            <button 
              onClick={logout} 
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#4a0044",
                fontWeight: "bold"
              }}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
