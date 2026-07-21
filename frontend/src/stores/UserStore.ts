import type { UserChange, UserInput, UserType } from "../types/UserType.ts";
import { create } from "zustand/react";
import { userApi } from "../services/apiCalls.ts";
import { useNotificationStore } from "./NotificationStore.ts";

type UserState = {
  users: UserType[];
  error: string | null;
  addUser: (inviteKey: string, userInput: UserInput) => void;
  getUser: (userId: number) => Promise<UserType | undefined>;
  getAllUsers: () => Promise<UserType[] | undefined>;
  updateUserRoles: (userId: number, role: string) => void;
  updateUser: (userId: number, updatedUser: UserChange) => Promise<boolean>;
  deleteUser: (userId: number) => void;
  onlineList: [];
  setOnlineList: (list: []) => void;
};

export const useUserStore = create<UserState>((set) => ({
  users: [],
  error: null,
  onlineList: [],

  addUser: async (inviteKey: string, userInput: UserInput) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await userApi.createUser(inviteKey, userInput);
      set((state: UserState) => ({
        users: [...state.users, data],
      }));
      if (data.isActive === true) {
        useNotificationStore
          .getState()
          .addNotification("User created successfully", "success");
      } else {
        useNotificationStore
          .getState()
          .addNotification(
            "E-Mail verification send. Check your Mails",
            "info",
          );
      }
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error creating user", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  getUser: async (userId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await userApi.getById(userId);
      set((state: UserState) => ({
        users: state.users.map((user) =>
          user.userId === userId ? { ...user, ...data } : user,
        ),
      }));
      return data;
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading user", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  getAllUsers: async () => {
    useNotificationStore.getState().startLoading();
    try {
      const data = await userApi.getAll();
      set({ users: data });
      return data;
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error loading user", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  updateUserRoles: async (userId: number, role: string) => {
    useNotificationStore.getState().startLoading();
    try {
      await userApi.updateRole(userId, role);
      // const data = await userApi.getById(userId);
      // set((state: UserState) => ({
      //   users: state.users.map((user) =>
      //     user.userId === userId ? { ...user, ...data } : user,
      //   ),
      // }));
      useNotificationStore
        .getState()
        .addNotification("User successfully changed", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error while changing", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  updateUser: async (userId: number, updatedUser: UserChange) => {
    useNotificationStore.getState().startLoading();
    try {
      await userApi.updateUser(userId, updatedUser);
      // const data = await userApi.getById(userId);
      // set((state: UserState) => ({
      //   users: state.users.map((user) =>
      //     user.userId === userId ? { ...user, ...data } : user,
      //   ),
      // }));
      useNotificationStore
        .getState()
        .addNotification("Profile successfully changed", "success");
      return true;
    } catch (e) {
      set({ error: "Error" + e });
      // eslint-disable-next-line
      const status = (e as any)?.response?.status;
      if (status === 403) {
        useNotificationStore
          .getState()
          .addNotification("Old password is wrong", "error");
      } else {
        useNotificationStore
          .getState()
          .addNotification("Error changing profile", "error");
      }
      return false;
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },

  deleteUser: async (userId: number) => {
    useNotificationStore.getState().startLoading();
    try {
      await userApi.delete(userId);
      set((state: UserState) => ({
        users: state.users.filter((user) => user.userId !== userId),
      }));
      useNotificationStore
        .getState()
        .addNotification("User successfully deleted", "success");
    } catch (e) {
      set({ error: "Error" + e });
      useNotificationStore
        .getState()
        .addNotification("Error during deletion", "error");
    } finally {
      useNotificationStore.getState().stopLoading();
    }
  },
  setOnlineList: (list: []) => {
    set({ onlineList: list });
  },
}));
