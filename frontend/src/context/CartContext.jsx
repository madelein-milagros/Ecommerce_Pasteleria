import { createContext, useContext } from "react";
import { useAddToCart } from "../api/cart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const addMutation = useAddToCart();

  const addToCart = (product, { onSuccess, onError } = {}) => {
    addMutation.mutate(
      {
        producto_id: product.id,
        cantidad: 1,
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();  // llamar mensaje desde ProductCard
        },
        onError: (err) => {
          if (onError) onError(err);
        },
      }
    );
  };

  return (
    <CartContext.Provider value={{ addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
