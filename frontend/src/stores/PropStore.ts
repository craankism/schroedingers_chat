import { create } from "zustand/react";

type PropState = {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
  openProfile: boolean;
  setOpenProfile: (open: boolean) => void;
};

export const usePropStore = create<PropState>((set) => ({
  openSidebar: false,
  openProfile: false,

  setOpenSidebar: (open: boolean) => {
    set({ openSidebar: open });
  },

  setOpenProfile: (open: boolean) => {
    set({ openProfile: open });
  },
}));
