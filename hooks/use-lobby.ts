import { Lobby } from "@/models/lobby";
import { LobbyUser } from "@/models/user";
import { create } from "zustand";

type UserMap = { [key: string]: LobbyUser };

type LobbyStore = {
  lobby: Lobby | null;
  loading: "idle" | "pending" | "success" | "fail";
  users: UserMap;
  isHost: boolean;
  fetchLobby: (lobbyId: string) => Promise<void>;
  resetLoading: () => void;
  addUser: (user: LobbyUser) => void;
  removeUser: (id: string) => void;
};

export const useLobby = create<LobbyStore>((set, get) => ({
  lobby: null,
  loading: "idle",
  users: {},
  isHost: false,
  fetchLobby: async (id) => {
    set({ loading: "pending", lobby: null });
    const res = await fetch(`/api/lobbies/${id}`);
    if (!res.ok) {
      set({ loading: "fail" });
      return;
    }
    const lobby: Lobby = await res.json();
    const users: UserMap = {};
    lobby.users.forEach((user) => (users[user.id] = user));
    set({ lobby, users, loading: "success" });
  },
  resetLoading: () => set({ loading: "idle" }),
  addUser: (user) => set({ users: { ...get().users, [user.id]: user } }),
  removeUser: (id) => {
    const users = get().users;
    delete users[id];
    set({ users: { ...users } });
  },
}));
