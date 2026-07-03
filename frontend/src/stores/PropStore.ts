import { create } from "zustand/react";

type PropState = {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
  openProfile: boolean;
  setOpenProfile: (open: boolean) => void;
  roomId: number;
  setRoomId: (roomId: number) => void;
};

export const usePropStore = create<PropState>((set) => ({
  openSidebar: false,
  openProfile: false,
  roomId: 2,

  setOpenSidebar: (open: boolean) => {
    set({ openSidebar: open });
  },

  setOpenProfile: (open: boolean) => {
    set({ openProfile: open });
  },

  setRoomId: (roomId: number) => {
    set({ roomId: roomId });
  },
}));
