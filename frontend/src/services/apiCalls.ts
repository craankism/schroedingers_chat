import type { FileInput, FileType } from "../types/FileType.ts";
import type { UserInput, UserType } from "../types/UserType.ts";
import type { RoomInput, RoomType } from "../types/RoomType.ts";
import type { MessageInput, MessageType } from "../types/MessageType.ts";
import type {
  AuthLoginType,
  registrationReturn,
} from "../types/AuthType.ts";
import api from "./axiosConfig.ts";

const fileUrl = "/file";
const userUrl = "/user";
const roomUrl = "/room";
const messageUrl = "/message";

const registrationUrl = "/auth/register";
const validationUrl = "/auth/register/validation";
const loginUrl = "/auth/login";
const createCodeUrl = "/admin/invite";

export const fileApi = {
  getAll: async (): Promise<FileType[]> => {
    const response = await api.get<FileType[]>(fileUrl);
    return response.data;
  },

  getById: async (fileId: number): Promise<FileType> => {
    const response = await api.get<FileType>(`${fileUrl}/${fileId}`);
    return response.data;
  },

  upload: async (file: FileInput): Promise<FileType> => {
    const response = await api.post<FileType>(fileUrl, file);
    return response.data;
  },

  delete: async (fileId: number): Promise<void> => {
    await api.delete(`${fileUrl}/${fileId}`);
  },
};

export const userApi = {
  getAll: async (): Promise<UserType[]> => {
    const response = await api.get<UserType[]>(userUrl);
    return response.data;
  },
  getById: async (userId: number): Promise<UserType> => {
    const response = await api.get<UserType>(`${userUrl}/${userId}`);
    return response.data;
  },
  createUser: async (
    registrationCode: string,
    user: UserInput,
  ): Promise<UserType> => {
    const response = await api.post<UserType>(
      `${registrationUrl}/${registrationCode}`,
      user,
    );
    return response.data;
  },
  delete: async (userId: number): Promise<void> => {
    await api.delete(`${userUrl}/${userId}`);
  },
};

export const roomApi = {
  getAll: async (): Promise<RoomType[]> => {
    const response = await api.get<RoomType[]>(roomUrl);
    return response.data;
  },

  getById: async (roomId: number): Promise<RoomType> => {
    const response = await api.get<RoomType>(`${roomUrl}/${roomId}`);
    return response.data;
  },

  create: async (room: RoomInput): Promise<RoomType> => {
    const response = await api.post<RoomType>(roomUrl, room);
    return response.data;
  },

  delete: async (roomId: number): Promise<void> => {
    await api.delete(`${roomUrl}/${roomId}`);
  },
};

export const messageApi = {
  getAll: async (): Promise<MessageType[]> => {
    const response = await api.get<MessageType[]>(messageUrl);
    return response.data;
  },

  getById: async (messageId: number): Promise<MessageType> => {
    const response = await api.get<MessageType>(`${messageUrl}/${messageId}`);
    return response.data;
  },

  post: async (message: MessageInput): Promise<MessageType> => {
    const response = await api.post<MessageType>(messageUrl, message);
    return response.data;
  },

  delete: async (messageId: number): Promise<void> => {
    await api.delete(`${messageUrl}/${messageId}`);
  },
};

export const authApi = {
  createRegistrationCode: async (
    registration: boolean,
  ): Promise<registrationReturn> => {
    const response = await api.post<registrationReturn>(
      createCodeUrl,
      registration
    );
    return response.data;
  },

  login: async (credentials: AuthLoginType): Promise<UserType> => {
    const response = await api.post<UserType>(loginUrl, credentials);
    return response.data;
  },

  validateCode: async (registrationCode: string) => {
    const response = await api.get<boolean>(
      `${validationUrl}/${registrationCode}`,
    );
    return response.data;
  },
};
