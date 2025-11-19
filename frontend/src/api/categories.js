import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API = "http://localhost:8000/api/categorias/";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const res = await axios.get(API);
      return res.data;
    }
  });
};

export const usePrefetchCategory = () => {
  const qc = useQueryClient();
  return (id) => {
    qc.prefetchQuery({
      queryKey: ["categoriaProductos", id],
      queryFn: async () =>
        (await axios.get(`http://localhost:8000/api/productos/?categoria=${id}`))
          .data
    });
  };
};
