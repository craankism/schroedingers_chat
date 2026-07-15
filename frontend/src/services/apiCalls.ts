import type { FileInput, FileType } from "../types/FileType.ts";
import type { UserChange, UserInput, UserType } from "../types/UserType.ts";
import type { RoomInput, RoomType } from "../types/RoomType.ts";
import type { MessageInput, MessageType } from "../types/MessageType.ts";
import type {
  AuthLoginType,
  registrationReturn,
  CodeValidationType,
  AuthResponseType,
} from "../types/AuthType.ts";
import api from "./axiosConfig.ts";
import type { DocumentType } from "../types/DocumentType.ts";
import type { FolderInput, FolderType } from "../types/FolderType.ts";

const fileUrl = "/file";
const userUrl = "/user";
const roomUrl = "/room";
const messageUrl = "/messages";
const documentUrl = "/documents";
const folderUrl = "/folder";

const authUrl = "/auth";
const adminUrl = "/admin";
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
    const url =
      fileInput.folderId != null
        ? `${fileUrl}/upload?folderId=${fileInput.folderId}`
        : `${fileUrl}/upload`;

    const response = await api.post<FileType>(url, formData, {
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

export const folderApi = {
  getAll: async (): Promise<FolderType[]> => {
    const response = await api.get<FolderType[]>(folderUrl);
    return response.data;
  },

  getById: async (id: number): Promise<FolderType> => {
    const response = await api.get<FolderType>(`${folderUrl}/${id}`);
    return response.data;
  },

  create: async (folderInput: FolderInput): Promise<FolderType> => {
    const response = await api.post<FolderType>(folderUrl, folderInput);
    return response.data;
  },

  delete: async (folderId: number): Promise<void> => {
    await api.delete(`${folderUrl}/${folderId}`);
  },
};

export const documentApi = {
  create: async (document: DocumentType): Promise<DocumentType> => {
    const response = await api.post<DocumentType>(documentUrl, document);
    return response.data;
  },

  getAll: async (): Promise<DocumentType[]> => {
    const response = await api.get<DocumentType[]>(documentUrl);
    return response.data;
  },

  getById: async (documentId: number): Promise<DocumentType> => {
    const response = await api.get<DocumentType>(
      `${documentUrl}/${documentId}`,
    );
    return response.data;
  },

  update: async (
    document: DocumentType,
    documentId: number,
  ): Promise<DocumentType> => {
    const response = await api.put<DocumentType>(
      `${documentUrl}/${documentId}`,
      document,
    );
    return response.data;
  },

  delete: async (documentId: number): Promise<void> => {
    await api.delete(`${documentUrl}/${documentId}`);
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
      `${authUrl}/register/${registrationCode}`,
      user,
    );
    return response.data;
  },
  updateRole: async (userId: number, role: string): Promise<void> => {
    await api.put(`${adminUrl}/user/${role}/${userId}`);
  },
  updateUser: async (
    userId: number,
    updatedUser: UserChange,
  ): Promise<void> => {
    await api.put(`${userUrl}/${userId}`, updatedUser);
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

  getMessages: async (roomId: number): Promise<MessageInput[]> => {
    const response = await api.get(`${websocket}/${roomId}`);
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
  checkAuthentication: async (): Promise<boolean> => {
    try {
      await api.get(`${userUrl}/check`);
      return true;
    } catch {
      return false;
    }
  },

  createRegistrationCode: async (
    registration: boolean,
  ): Promise<registrationReturn> => {
    const response = await api.post<registrationReturn>(
      `${adminUrl}/invite`,
      registration,
    );
    return response.data;
  },

  login: async (credentials: AuthLoginType): Promise<AuthResponseType> => {
    const response = await api.post<AuthResponseType>(
      `${authUrl}/login`,
      credentials,
    );
    return response.data;
  },

  onlineStatus: async (userId: number, status: boolean): Promise<void> => {
    await api.post<boolean>(`${authUrl}/online/${userId}`, status);
  },

  validateCode: async (
    registrationCode: string,
  ): Promise<CodeValidationType> => {
    const response = await api.get<CodeValidationType>(
      `${authUrl}/register/validation/${registrationCode}`,
    );
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponseType> => {
    const response = await api.post(`${authUrl}/refresh`, { refreshToken });
    return response.data;
  },

  logout: async (refreshToken: string) => {
    await api.post(`${authUrl}/logout`, { refreshToken });
  },
};
