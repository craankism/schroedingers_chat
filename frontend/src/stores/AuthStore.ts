import type {UserType} from "../types/UserType.ts";
import {create} from "zustand/react";
import type {AuthLoginType, registrationInput} from "../types/AuthType.ts";
import {useNotificationStore} from "./NotificationStore.ts";
import {authApi} from "../services/apiCalls.ts";

type AuthState = {
    error: string | null;
    token: string | null;
    currentUser: UserType | null;
    isAuthenticated: boolean;
    login: (login: AuthLoginType) => void;
    logout: () => void;
    addRegistrationCode: (registration: registrationInput) => Promise<string | null>;
    validateRegistrationCode: (registrationCode: string) => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set) => ({
    error: null,
    token: localStorage.getItem('jwt'),
    currentUser: null,
    isAuthenticated: !!localStorage.getItem('jwt'),

    login: async (login: AuthLoginType) => {
        useNotificationStore.getState().startLoading();
        try {
            const data = await authApi.login(login);
            set({token: data.jwt, currentUser: data, isAuthenticated: true});
            localStorage.setItem('jwt', data.jwt);
            useNotificationStore.getState().addNotification("Login Erfolgreich", "success");
        } catch (e) {
            set({error: "Fehler" + e})
            useNotificationStore.getState().addNotification("Fehler beim Login", "error");
        } finally {
            useNotificationStore.getState().stopLoading();
        }
    },

    logout: () => {
        localStorage.removeItem('jwt');
        set({token: null, currentUser: null, isAuthenticated: false})
    },

    addRegistrationCode: async (registration: registrationInput) => {
        useNotificationStore.getState().startLoading();
        try {
            const data = await authApi.createRegistrationCode(registration);
            useNotificationStore.getState().addNotification("Einladung erfolgreich angelegt", "success");
            return data.registrationCode;
        } catch (e) {
            set({error: "Fehler" + e});
            useNotificationStore.getState().addNotification("Fehler beim Erstellen der Einladung", "error");
            return null;
        } finally {
            useNotificationStore.getState().stopLoading();
        }
    },

    validateRegistrationCode: async (registrationCode: string) => {
        useNotificationStore.getState().startLoading();
        try {
            const data = await authApi.validateCode(registrationCode);
            useNotificationStore.getState().addNotification("Code ist korrekt", "success");
            return data;
        } catch (e) {
            set({error: "Fehler" + e});
            useNotificationStore.getState().addNotification("Fehler beim Erstellen der Einladung", "error");
            return false;
        } finally {
            useNotificationStore.getState().stopLoading();
        }
    },

}))