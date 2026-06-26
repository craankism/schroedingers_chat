import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/AuthStore.ts";
import { endpointUrl } from "../types/constants/constants.ts";
import { useNotificationStore } from "../stores/NotificationStore.ts";

const api = axios.create({
  baseURL: endpointUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //TODO: /register might need to be changed!
    if (config.url?.includes("/login") || config.url?.includes("/register")) {
      return config;
    }

    const token = localStorage.getItem("jwt");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      useNotificationStore
        .getState()
        .addNotification("Login muss noch durchgeführt werden", "error");
      return Promise.reject(new Error("No Auth Token"));
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default api;
