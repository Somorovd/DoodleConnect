import { create } from "zustand";

type CanvasStore = {
  color: string;
  size: number;
  menuOpen: boolean;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setMenuOpen: (menuOpen: boolean) => void;
};

export const useCanvas = create<CanvasStore>((set) => ({
  color: "#000000",
  size: 3,
  menuOpen: false,
  setColor: (color) => set({ color }),
  setSize: (size) => set({ size }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));
