import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Categorias from "./pages/Categorias";
import ProductosPorCategoria from "./pages/ProductosPorCategoria";
import { CartProvider } from "./context/CartContext";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categoria/:id" element={<ProductosPorCategoria />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
