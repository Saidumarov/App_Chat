import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./token.service";
const BASE_URI = import.meta.env.VITE_MKBANK_AI_API;

export const deleteData = async ({ url }) => {
  try {
    const res = await api.delete(`${BASE_URI}${url}`);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const useDelete = (type) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
};

export const deleteData2 = async ({ url, body }) => {
  try {
    console.log(body);
    const res = await api.delete(`${BASE_URI}${url}`, { data: body });
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const useDelete2 = (type) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteData2,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
};
