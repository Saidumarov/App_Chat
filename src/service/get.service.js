import { api } from "./token.service";
const BASE_URI = import.meta.env.VITE_MKBANK_AI_API;

export const getData = async (url) => {
  try {
    const res = await api.get(`${BASE_URI}${url}`);
    return res?.data;
  } catch (error) {
    return error?.response?.status;
  }
};
