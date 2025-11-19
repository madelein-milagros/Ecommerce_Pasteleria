import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-left">
        <Link to="/">Pastelería</Link>
        <Link to="/categorias">Categorías</Link>
      </div>

      <div className="nav-right">
        <Link to="/carrito" className="carrito-link">
          🛒 Carrito
        </Link>
      </div>
    </div>
  );
}
