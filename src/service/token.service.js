import axios from "axios";
const BASE_URI = import.meta.env.VITE_MKBANK_AI_API;
export const api = axios.create({
  baseURL: BASE_URI,
});
