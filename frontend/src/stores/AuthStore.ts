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
    addRegistrationCode: (registration: registrationInput) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    error: null,
    token: localStorage.getItem('jwt'),
    currentUser: null,
    isAuthenticated: !!localStorage.getItem('jwt'),

    login: async (login: AuthLoginType) => {
        useNotificationStore.getState().startLoading();
        try {
            await authApi.login(login);
            //TODO do we need more Logic here?
            useNotificationStore.getState().addNotification("Login Erfolgreich", "success");
        } catch (e) {
            set({error: "Fehler" + e})
            useNotificationStore.getState().addNotification("Fehler beim Login", "error");
        } finally {
            useNotificationStore.getState().stopLoading();
        }
    },

    addRegistrationCode: async (registration: registrationInput) => {
        useNotificationStore.getState().startLoading();
        try {
            await authApi.createRegistrationCode(registration);
            //TODO Logic?
            useNotificationStore.getState().addNotification("Einladung erfolgreich angelegt", "success");
        } catch (e) {
            set({error: "Fehler" + e});
            useNotificationStore.getState().addNotification("Fehler beim ERstellen der Einladung", "error");
        } finally {
            useNotificationStore.getState().stopLoading();
        }
    },

}))