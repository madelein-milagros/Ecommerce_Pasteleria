import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API = "http://localhost:8000/api/carrito/";

export const useCart = () => {
  return useQuery({
    queryKey: ["carrito"],
    queryFn: async () => (await axios.get(API)).data
  });
};

export const useAddToCart = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ producto_id, cantidad }) =>
      (await axios.post(`${API}items/`, { producto_id, cantidad })).data,
    onSuccess: () => qc.invalidateQueries(["carrito"])
  });
};

export const useUpdateCartItem = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, cantidad }) =>
      (await axios.patch(`${API}items/${itemId}/`, { cantidad })).data,
    onSuccess: () => qc.invalidateQueries(["carrito"])
  });
};

export const useDeleteCartItem = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId }) =>
      axios.delete(`${API}items/${itemId}/`),
    onSuccess: () => qc.invalidateQueries(["carrito"])
  });
};
