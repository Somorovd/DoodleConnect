import { create } from "zustand";

type CanvasStore = {
  color: string;
  setColor: (color: string) => void;
};

export const useCanvas = create<CanvasStore>((set) => ({
  color: "#000000",
  setColor: (color) => set({ color }),
}));
