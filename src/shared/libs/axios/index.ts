import axios from "axios";

// backend server
export const serviceApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
