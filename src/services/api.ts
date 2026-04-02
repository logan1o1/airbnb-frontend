import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  signup: (data: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => api.post("/auth/signup", data),
  logout: () => api.post("/auth/logout"),
};

// Listings endpoints
export const listingsAPI = {
  getAll: () => api.get("/listings"),
  getById: (id: string) => api.get(`/listings/${id}`),
  create: (data: {
    name: string;
    location: string;
    price: number;
    pictures?: string[];
  }) => api.post("/listings", data),
};

// Bookings endpoints
export const bookingsAPI = {
  getAll: () => api.get("/bookings"),
  getById: (id: string) => api.get(`/bookings/${id}`),
  create: (data: {
    booked_listing: string;
    from: string;
    to: string;
    idempotency_key?: string;
  }) => api.post("/bookings", data),
};

// Payments endpoints
export const paymentsAPI = {
  create: (data: { booking_id: string; idempotency_key?: string }) =>
    api.post("/payments", data),
};

export default api;
