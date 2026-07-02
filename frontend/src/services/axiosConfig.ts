import axios, {type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig} from "axios";
import {useAuthStore} from "../stores/AuthStore.ts";
import {endpointUrl} from "../types/constants/constants.ts";
import {useNotificationStore} from "../stores/NotificationStore.ts";

const api = axios.create({
    baseURL: endpointUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (
            config.url?.includes("/login") ||
            config.url?.includes("/register") ||
            config.url?.includes("/refresh") ||
            config.url?.includes("/logout")
        ) {
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

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else if (token) {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };
        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        if (
            originalRequest.url?.includes("/refresh") ||
            originalRequest.url?.includes("/login") ||
            originalRequest.url?.includes("/logout")
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        } else {
                            originalRequest.headers = { Authorization: `Bearer ${token}` };
                        }
                        resolve(api(originalRequest));
                    },
                    reject: (err: unknown) => {
                        reject(err);
                    }
                })
            })
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const newToken = await useAuthStore.getState().refreshToken();

            if (!newToken) {
                processQueue(error, null);
                return Promise.reject(error);
            }

            processQueue(null, newToken);

            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
            } else {
                originalRequest.headers = { Authorization: `Bearer ${newToken}` };
            }
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export default api;
