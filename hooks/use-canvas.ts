import { create } from "zustand";

type CanvasStore = {
  color: string;
  size: number;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
};

export const useCanvas = create<CanvasStore>((set) => ({
  color: "#000000",
  size: 3,
  setColor: (color) => set({ color }),
  setSize: (size) => set({ size }),
}));
