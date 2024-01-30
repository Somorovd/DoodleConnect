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
  addUser: (user: LobbyUser) => void;
  removeUser: (id: string) => void;
};

export const useLobby = create<LobbyStore>((set, get) => ({
  lobby: null,
  loading: "idle",
  users: {},
  fetchLobby: async (id) => {
    set({ loading: "pending", lobby: null });
    const res = await fetch(`/api/lobbies/${id}`);
    if (!res.ok) {
      set({ loading: "complete" });
      return;
    }
    const lobby: Lobby = await res.json();
    const users: UserMap = {};
    lobby.users.forEach((user) => (users[user.id] = user));
    set({ lobby, users, loading: "complete" });
  },
  resetLoading: () => set({ loading: "idle" }),
  addUser: (user) => set({ users: { ...get().users, [user.id]: user } }),
  removeUser: (id) => {
    const users = get().users;
    delete users[id];
    set({ users });
  },
}));
