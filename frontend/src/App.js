import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Categorias from "./pages/Categorias";
import ProductosPorCategoria from "./pages/ProductosPorCategoria";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Historial from "./pages/Historial";
import Checkout from "./pages/Checkout";

import { CartProvider } from "./context/CartContext";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />

        <Routes>
          {/* Rutas principales */}
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categoria/:id" element={<ProductosPorCategoria />} />

          {/* Nuevas rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Historial de compras */}
          <Route path="/historial" element={<Historial />} />

          {/* Checkout (pago con Stripe) */}
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
