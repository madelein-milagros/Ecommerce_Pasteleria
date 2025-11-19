import { createContext, useContext } from "react";
import { useAddToCart } from "../api/cart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const addMutation = useAddToCart();

  const addToCart = (product) => {
    addMutation.mutate({
      producto_id: product.id,
      cantidad: 1
    });
    alert("Producto añadido al carrito 🎉");
  };

  return (
    <CartContext.Provider value={{ addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
