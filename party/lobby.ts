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

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {}

  onMessage(message: string, sender: Party.Connection) {
    const msg: LobbyEventMessage<any> = JSON.parse(message);
    switch (msg.event) {
      case LobbyEvent.UserJoined:
        this.connectionUsers[sender.id] = msg.data.user;
        console.log(`JOIN: user ${sender.id} joined ${this.room.id}`);
        break;
      case LobbyEvent.UserLeft:
        this.onUserLeft(sender);
        break;
    }
    this.room.broadcast(message, [sender.id]);
  }

  async onClose(conn: Party.Connection) {
    await this.onUserLeft(conn);
  }

  async onUserLeft(conn: Party.Connection) {
    if (!this.connectionUsers[conn.id]) return;
    console.log(`LEAVE: user ${conn.id} left ${this.room.id}`);
    await fetch(
      `${this.room.env.NEXT_PUBLIC_URL}/api/lobbies/${this.room.id}/remove`,
      {
        method: "put",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user: this.connectionUsers[conn.id] }),
      }
    );
    delete this.connectionUsers[conn.id];
  }
}
