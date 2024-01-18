import { Lobby } from "@/models/lobby";
import { LobbyUser } from "@/models/user";
import { create } from "zustand";

type UserMap = { [key: string]: LobbyUser };

type LobbyStore = {
  lobby: Lobby | null;
  loading: "idle" | "pending" | "complete";
  users: UserMap;
  fetchLobby: (id: string) => Promise<void>;
  resetLoading: () => void;
};

export const useLobby = create<LobbyStore>((set) => ({
  lobby: null,
  loading: "idle",
  users: {},
  fetchLobby: async (id) => {
    set({ loading: "pending" });
    const res = await fetch(`/api/lobbies/${id}`);
    if (!res.ok) return;

    const lobby: Lobby = await res.json();
    const users: UserMap = {};
    lobby.users.forEach((user) => (users[user.id] = user));
    set({ lobby, users, loading: "complete" });
  },
  resetLoading: () => set({ loading: "idle" }),
}));
