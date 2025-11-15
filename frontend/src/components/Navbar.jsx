import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaArrowLeft, FaArrowRight, FaBirthdayCake } from "react-icons/fa";

export default function Navbar() {
  const { items } = useCart();
  const navigate = useNavigate();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="nav-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <button className="nav-btn" onClick={() => navigate(1)}>
          <FaArrowRight />
        </button>
      </div>

      <div className="logo">
        <FaBirthdayCake className="logo-icon" />
        <Link to="/">Pastelería Online</Link>
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/carrito" className="carrito-link">
          <FaShoppingCart /> ({totalItems})
        </Link>
      </div>
    </nav>
  );
}
