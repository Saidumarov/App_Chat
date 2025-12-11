import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./token.service";
const BASE_URI = import.meta.env.VITE_MKBANK_AI_API;

export const updateData = async ({ url, body }) => {
  try {
    const res = await api.put(`${BASE_URI}${url}`, body);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const useUpdate = (type) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
};
