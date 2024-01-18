import { Lobby } from "@/models/lobby";
import { create } from "zustand";

type LobbyStore = {
  lobby: Lobby | null;
  loading: "idle" | "pending" | "complete";
  fetchLobby: (id: string) => Promise<void>;
  resetLoading: () => void;
};

export const useLobby = create<LobbyStore>((set) => ({
  lobby: null,
  loading: "idle",
  fetchLobby: async (id) => {
    set({ loading: "pending" });
    const res = await fetch(`/api/lobbies/${id}`);
    if (res.ok) {
      set({ lobby: await res.json(), loading: "complete" });
    }
  },
  resetLoading: () => set({ loading: "idle" }),
}));
