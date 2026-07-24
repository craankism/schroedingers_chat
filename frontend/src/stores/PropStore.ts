import { create } from "zustand/react";

type PropState = {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
  openProfile: boolean;
  setOpenProfile: (open: boolean) => void;
  roomId: number;
  setRoomId: (roomId: number) => void;
  openConfirmation: boolean;
  setOpenConfirmation: (open: boolean) => void;
  confirmation: boolean;
  setConfirmation: (yes: boolean) => void;
  newDocModalOpen: boolean;
  setNewDocModalOpen: (open: boolean) => void;
  editDocModalOpen: boolean;
  setEditDocModalOpen: (open: boolean) => void;
  editDocId: number | null;
  setEditDocId: (id: number | null) => void;
  smtpModalOpen: boolean;
  setSmtpModalOpen: (open: boolean) => void;
};

export const usePropStore = create<PropState>((set) => ({
  openSidebar: false,
  openProfile: false,
  roomId: parseInt(localStorage.getItem("selectedRoomId") ?? "2", 10),
  confirmation: false,
  openConfirmation: false,
  newDocModalOpen: false,
  smtpModalOpen: false,
  editDocModalOpen: false,
  editDocId: null,

  setOpenSidebar: (open: boolean) => {
    set({ openSidebar: open });
  },

  setOpenProfile: (open: boolean) => {
    set({ openProfile: open });
  },

  setRoomId: (roomId: number) => {
    localStorage.setItem("selectedRoomId", String(roomId));
    set({
      roomId,
    });
  },

  setOpenConfirmation: (open: boolean) => {
    set({ openConfirmation: open });
  },

  setConfirmation: (yes: boolean) => {
    set({ confirmation: yes });
  },

  setNewDocModalOpen: (open: boolean) => {
    set({ newDocModalOpen: open });
  },

  setEditDocModalOpen: (open: boolean) => {
    set({ editDocModalOpen: open });
  },

  setEditDocId: (id: number | null) => {
    set({ editDocId: id });
  },

  setSmtpModalOpen: (open: boolean) => {
    set({ smtpModalOpen: open });
  },
}));
