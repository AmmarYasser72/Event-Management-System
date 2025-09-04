import axios from "axios";
export const api = axios.create({
  baseURL: "/api",      // works on Vercel + local via proxy
  withCredentials: true
});
