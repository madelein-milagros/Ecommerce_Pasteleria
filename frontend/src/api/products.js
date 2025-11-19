import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API = "http://localhost:8000/api/productos/";

export const useProducts = ({ search = "", categoria = null }) => {
  return useQuery({
    queryKey: ["productos", { search, categoria }],
    queryFn: async () => {
      const res = await axios.get(API, {
        params: { search, categoria }
      });
      return res.data;
    }
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["producto", id],
    queryFn: async () => {
      const res = await axios.get(`${API}${id}/`);
      return res.data;
    }
  });
};

export const usePrefetchProduct = () => {
  const qc = useQueryClient();
  return (id) => {
    qc.prefetchQuery({
      queryKey: ["producto", id],
      queryFn: async () => {
        const res = await axios.get(`${API}${id}/`);
        return res.data;
      }
    });
  };
};
