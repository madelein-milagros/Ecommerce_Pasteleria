import axios from "axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const API = "http://localhost:8000/api/carrito/";

/* ============================================================
   🛒 Obtener el carrito (SIEMPRE actualizado gracias a queryKey)
   ============================================================ */
export const useCart = () => {
  return useQuery({
    queryKey: ["carrito"],
    queryFn: async () => (await axios.get(API)).data,
  });
};

/* ============================================================
   ➕ Añadir al carrito
   ============================================================ */
export const useAddToCart = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ producto_id, cantidad }) =>
      (await axios.post(`${API}items/`, { producto_id, cantidad })).data,

    onSuccess: () => {
      qc.invalidateQueries(["carrito"]);
    },

    onError: () => {
      // Si quieres manejar errores aquí también puedes
    },
  });
};

/* ============================================================
   🔄 Actualizar cantidad con OPTIMISTIC UPDATE + ROLLBACK
   ============================================================ */
export const useUpdateCartItem = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, cantidad }) =>
      (await axios.patch(`${API}items/${itemId}/`, { cantidad })).data,

    onMutate: async ({ itemId, cantidad }) => {
      await qc.cancelQueries(["carrito"]);

      const previousCart = qc.getQueryData(["carrito"]);

      qc.setQueryData(["carrito"], (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.map((item) =>
            item.id === itemId
              ? { ...item, cantidad, subtotal: cantidad * item.producto.precio }
              : item
          ),
          total: old.items.reduce(
            (acc, item) =>
              item.id === itemId
                ? acc + cantidad * item.producto.precio
                : acc + item.subtotal,
            0
          ),
        };
      });

      return { previousCart };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        qc.setQueryData(["carrito"], context.previousCart);
      }
    },

    onSettled: () => {
      qc.invalidateQueries(["carrito"]);
    },
  });
};

/* ============================================================
   🗑️ Eliminar item con optimistic update
   ============================================================ */
export const useDeleteCartItem = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId }) =>
      axios.delete(`${API}items/${itemId}/`),

    onMutate: async ({ itemId }) => {
      await qc.cancelQueries(["carrito"]);

      const previousCart = qc.getQueryData(["carrito"]);

      qc.setQueryData(["carrito"], (old) => {
        if (!old) return old;

        const newItems = old.items.filter((item) => item.id !== itemId);
        const newTotal = newItems.reduce(
          (t, i) => t + i.subtotal,
          0
        );

        return { ...old, items: newItems, total: newTotal };
      });

      return { previousCart };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        qc.setQueryData(["carrito"], context.previousCart);
      }
    },

    onSettled: () => {
      qc.invalidateQueries(["carrito"]);
    },
  });
};
