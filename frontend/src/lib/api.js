import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export function getStoredAuth() {
  try {
    const token = JSON.parse(localStorage.getItem("userToken") || "{}")?.token || "";
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return { token, user };
  } catch {
    return { token: "", user: null };
  }
}

export function setStoredAuth({ token, user }) {
  if (token) {
    localStorage.setItem("userToken", JSON.stringify({ token }));
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function clearStoredAuth() {
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
}

api.interceptors.request.use((config) => {
  const { token } = getStoredAuth();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
