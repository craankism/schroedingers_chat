import type {UserInput, UserInvitation, UserType} from "../types/UserType.ts";
import {create} from "zustand/react";
import {userApi} from "../services/apiCalls.ts";
import {useNotificationStore} from "./NotificationStore.ts";

type UserState = {
    users: UserType[],
    error: string | null,
    addUser: (inviteKey: string, userInput: UserInput) => void;
    addInvitation: (invitation: UserInvitation) => void;
    getUser: (userId: number) => void;
    getAllUsers: () => void;
    deleteUser: (userId: number) => void;
}

export const useUserStore = create<UserState>(
    (set) => ({
        users: [],
        error: null,

        addUser: async (inviteKey: string, userInput: UserInput) => {
            useNotificationStore.getState().startLoading();
            try {
                const data = await userApi.createUser(inviteKey, userInput);
                set((state: UserState) => ({
                    users: state.users.map(user =>
                        user.inviteKey === inviteKey ? {...user, ...data} : user)
                }));
                useNotificationStore.getState().addNotification("User erfolgreich angelegt", "success");
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Anlegen des Nutzers", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        },

        addInvitation: async (invitation: UserInvitation) => {
            useNotificationStore.getState().startLoading();
            try {
                const data = await userApi.createInvitation(invitation);
                set((state: UserState) => ({
                    users: [...state.users, data]
                }));
                useNotificationStore.getState().addNotification("Einladung erfolgreich angelegt", "success");
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim ERstellen der Einladung", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        },

        getUser: async (userId: number) => {
            useNotificationStore.getState().startLoading();
            try {
                const data = await userApi.getById(userId);
                set((state: UserState) => ({
                    users: state.users.map(user => user.userId === userId ? {...user, ...data} : user)
                }))
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Laden des Users", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        },

        getAllUsers: async () => {
            useNotificationStore.getState().startLoading();
            try {
                const data = await userApi.getAll();
                set({users: data})
            } catch (e) {
                set({error: "Fehler" + e});
                useNotificationStore.getState().addNotification("Fehler beim Laden der User", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        },
        deleteUser: async (userId: number) => {
            useNotificationStore.getState().startLoading();
            try {
                await userApi.delete(userId);
                set((state: UserState) => ({
                    users: state.users.filter(user => user.userId !== userId)
                }));
                useNotificationStore.getState().addNotification("User erfolgreich gelöscht", "success");
            } catch (e) {
                set({error: "Fehler" + e})
                useNotificationStore.getState().addNotification("Fehler beim Löschen", "error");
            } finally {
                useNotificationStore.getState().stopLoading();
            }
        }
    })
)