import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./token.service";
const BASE_URI = import.meta.env.VITE_MKBANK_AI_API;

export const postData = async ({ url, body }) => {
  try {
    const res = await api.post(`${BASE_URI}${url}`, body);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const usePost = (type) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
    },
  });
};
