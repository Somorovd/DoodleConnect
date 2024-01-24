import { LobbyUser } from "@/models/user";
import type * as Party from "partykit/server";

export enum LobbyEvent {
  UserJoined = "user-joined",
  UserLeft = "user-left",
}

type LobbyMessageData = {
  [LobbyEvent.UserJoined]: {
    user: LobbyUser;
  };
  [LobbyEvent.UserLeft]: {
    user: LobbyUser;
  };
};

export type LobbyEventMessage<E extends LobbyEvent> = {
  event: E;
  data: LobbyMessageData[E];
};

export default class LobbyServer implements Party.Server {
  private connectionUsers: { [key: string]: { id: string } } = {};
  private userIds = new Set<string>();

  constructor(readonly room: Party.Room) {}

  async onStart() {
    if (this.room.id) {
      await this.room.storage.put<string>("id", this.room.id);
    }
  }

  onConnect(conn: Party.Connection) {}

  onMessage(message: string, sender: Party.Connection) {
    const msg: LobbyEventMessage<any> = JSON.parse(message);
    switch (msg.event) {
      case LobbyEvent.UserJoined:
        const data: LobbyMessageData[LobbyEvent.UserJoined] = msg.data;
        this.connectionUsers[sender.id] = msg.data.user;
        this.userIds.add(data.user.id);
        console.log(`JOIN: user ${data.user.id} joined ${this.room.id}`);
        break;
      case LobbyEvent.UserLeft:
        this.onUserLeft(sender);
        break;
    }
    this.room.broadcast(message, [sender.id]);
  }

  async onClose(conn: Party.Connection) {
    const userId = this.connectionUsers[conn.id].id;
    this.userIds.delete(userId);
    setTimeout(async () => {
      if (!this.userIds.has(userId)) {
        await this.onUserLeft(conn);
      }
    }, 30 * 1000);
  }

  async onUserLeft(conn: Party.Connection) {
    if (!this.connectionUsers[conn.id]) return;
    console.log(`LEAVE: user ${conn.id} left ${this.room.id}`);
    await fetch(
      `${this.room.env.NEXT_PUBLIC_URL}/api/lobbies/${this.room.id}/leave`,
      {
        method: "put",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user: this.connectionUsers[conn.id] }),
      }
    );
    delete this.connectionUsers[conn.id];
    // 2 minute timer
    this.room.storage.setAlarm(Date.now() + 2 * 60 * 1000);
  }

  async onAlarm() {
    if (Object.keys(this.connectionUsers).length !== 0) return;

    const id = await this.room.storage.get<string>("id");
    await fetch(`${this.room.env.NEXT_PUBLIC_URL}/api/lobbies/${id}`, {
      method: "delete",
    });
  }
}
