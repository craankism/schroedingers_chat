import type { FileInput, FileType } from "../types/FileType.ts";
import type { UserInput, UserType } from "../types/UserType.ts";
import type { RoomInput, RoomType } from "../types/RoomType.ts";
import type { MessageInput, MessageType } from "../types/MessageType.ts";
import type {
  AuthLoginType,
  registrationReturn,
  CodeValidationType,
} from "../types/AuthType.ts";
import api from "./axiosConfig.ts";

const fileUrl = "/file";
const userUrl = "/user";
const roomUrl = "/room";
const messageUrl = "/messages";

const registrationUrl = "/auth/register";
const validationUrl = "/auth/register/validation";
const loginUrl = "/auth/login";
const createCodeUrl = "/admin/invite";
const changeUserUrl = "/admin/user";
const websocket = "/messages";

export const fileApi = {
  getAllMeta: async (): Promise<FileType[]> => {
    const response = await api.get<FileType[]>(fileUrl);
    return response.data;
  },

  getByIdMeta: async (fileId: number): Promise<FileType> => {
    const response = await api.get<FileType>(`${fileUrl}/${fileId}`);
    return response.data;
  },

  upload: async (fileInput: FileInput): Promise<FileType> => {
    const formData = new FormData();
    formData.append("file", fileInput.file);

    const response = await api.post<FileType>(fileUrl + "/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  download: async (fileId: number): Promise<Blob> => {
    const response = await api.get(`${fileUrl}/download/${fileId}`, {
      responseType: "blob",
    });
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
  update: async (userId: number, role: string): Promise<void> => {
    await api.put(`${changeUserUrl}/${role}/${userId}`);
  },
  delete: async (userId: number): Promise<void> => {
    await api.delete(`${changeUserUrl}/${userId}`);
  },
};

export const roomApi = {
  getMessages: async (roomId: number): Promise<MessageInput[]> => {
    const response = await api.get(`${websocket}/${roomId}`);
    return response.data;
  },

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

  update: async (room: RoomInput, roomId: number): Promise<RoomType> => {
    const response = await api.put<RoomType>(`${roomUrl}/${roomId}`, room);
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
      registration,
    );
    return response.data;
  },

  login: async (credentials: AuthLoginType): Promise<UserType> => {
    const response = await api.post<UserType>(loginUrl, credentials);
    return response.data;
  },

  validateCode: async (
    registrationCode: string,
  ): Promise<CodeValidationType> => {
    const response = await api.get<CodeValidationType>(
      `${validationUrl}/${registrationCode}`,
    );
    return response.data;
  },
};
