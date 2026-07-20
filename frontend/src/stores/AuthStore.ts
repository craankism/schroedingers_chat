import type { UserType } from "../types/UserType.ts";
import { create } from "zustand/react";
import type { AuthLoginType, CodeValidationType } from "../types/AuthType.ts";
import { useNotificationStore } from "./NotificationStore.ts";
import { authApi } from "../services/apiCalls.ts";

export function decodeJwt(): UserType | null {
  try {
    const token = localStorage.getItem("jwt") || "";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      userId: payload.userId,
      email: payload.email,
      displayName: payload.displayName,
      isAdmin: payload.isAdmin,
      isTrainer: payload.isTrainer,
      jwt: token,
    };
  } catch {
    return null;
  }
}

type AuthState = {
  error: string | null;
  token: string | null;
  currentUser: UserType | null;
  isAuthenticated: boolean;
  checkAuthentication: () => Promise<boolean>;
  login: (login: AuthLoginType) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  verifyEmail: (token: string) => Promise<void>;
  addRegistrationCode: (registration: boolean) => Promise<string | null>;
  validateRegistrationCode: (
    registrationCode: string,
  ) => Promise<CodeValidationType>;
};

export const useAuthStore = create<AuthState>((set) => ({
  error: null,
  token: localStorage.getItem("jwt"),
  currentUser: decodeJwt(),
  isAuthenticated: !!localStorage.getItem("jwt"),

  checkAuthentication: async () => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await authApi.checkAuthentication();
      set({ isAuthenticated: data });
      return data;
    } catch {
      set({ isAuthenticated: false });
      return false;
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  login: async (login: AuthLoginType) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await authApi.login(login);
      set({ token: data.jwt, currentUser: data, isAuthenticated: true });
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("refreshToken", data.refreshToken);
      useNotificationStore
        .getState()
        .addNotification("Login successful", "success");
    } catch (e) {
      set({ error: "Fehler" + e });
      useNotificationStore.getState().addNotification("Login error", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  logout: async () => {
    useNotificationStore.getState().startLoading();
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
        useNotificationStore
          .getState()
          .addNotification("Logout successful", "success");
      } catch (e) {
        set({ error: "Error" + e });
      } finally {
        useNotificationStore.getState().stopLoading();
      }
    }
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    set({ token: null, currentUser: null, isAuthenticated: false });
  },

  refreshToken: async () => {
    useNotificationStore.getState().startLoading();
    const rawRefreshToken = localStorage.getItem("refreshToken");
    if (!rawRefreshToken) return null;
    try {
      const data = await authApi.refresh(rawRefreshToken);
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("refreshToken", data.refreshToken);
      set({
        token: data.jwt,
        currentUser: data,
        isAuthenticated: true,
      });
      return data.jwt;
    } catch (e) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("refreshToken");
      set({
        token: null,
        currentUser: null,
        isAuthenticated: false,
        error: "Error" + e,
      });
      useNotificationStore
        .getState()
        .addNotification("Session expired, please log in again.", "error");
      return null;
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  verifyEmail: async (token: string) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await authApi.verify(token);
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("refreshToken", data.refreshToken);
      set({ token: data.jwt, currentUser: data, isAuthenticated: true });
      useNotificationStore
        .getState()
        .addNotification("Email verified successfully", "success");
    } catch (e) {
      set({ error: "Verification failed: " + e });
      useNotificationStore
        .getState()
        .addNotification("Email verification failed", "error");
      throw e;
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  addRegistrationCode: async (registration: boolean) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await authApi.createRegistrationCode(registration);
      useNotificationStore
        .getState()
        .addNotification("Invitation successfully created", "success");
      return data.registrationCode;
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error creating invitation", "error");
      return null;
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  validateRegistrationCode: async (registrationCode: string) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await authApi.validateCode(registrationCode);
      if (data.valid) {
        useNotificationStore
          .getState()
          .addNotification("Code is correct", "success");
      } else {
        useNotificationStore
          .getState()
          .addNotification("Code is invalid", "error");
      }
      return data;
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error validating the code", "error");
      return { valid: false };
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },
}));
