import type {UserInput, UserType} from "../types/UserType.ts";
import {create} from "zustand/react";
import {userApi} from "../services/apiCalls.ts";

type UserState = {
    users: UserType[],
    error: string | null,
    addUser: (userInput: UserInput) => void;
    getUser: (userId: number) => void;
    getAllUsers: () => void;
    deleteUser: (userId: number) => void;
}

export const useUserStore = create<UserState>(
    (set) => ({
        users: [],
        error: null,

        addUser: async (userInput: UserInput) => {
            try {
                const data = await userApi.create(userInput);
                set((state: UserState) => ({
                    users: [...state.users, data]
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        getUser: async (userId: number) => {
            try {
                const data = await userApi.getById(userId);
                set((state: UserState) => ({
                    users: state.users.map(user => user.userId === userId ? {...user, ...data} : user)
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },

        getAllUsers: async () => {
            try {
                const data = await userApi.getAll();
                set({users: data})
            } catch (e) {
                set({error: "Fehler" + e})
            }
        },
        deleteUser: async (userId: number) => {
            try {
                await userApi.delete(userId);
                set((state: UserState) => ({
                    users: state.users.filter(user => user.userId !== userId)
                }))
            } catch (e) {
                set({error: "Fehler" + e})
            }
        }
    })
)