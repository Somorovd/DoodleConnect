import usePartySocket from "partysocket/react";
import { useLobby } from "./use-lobby";
import { useEffect } from "react";
import { LobbyEvent, LobbyEventMessage } from "@/party/lobby";
import { useUser } from "@clerk/nextjs";

export const useLobbySocket = () => {
  const { user: self } = useUser();
  const lobbyId = useLobby((state) => state.lobby?._id);
  const addUser = useLobby((state) => state.addUser);
  const removeUser = useLobby((state) => state.removeUser);
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
    party: "lobby",
    room: `${lobbyId}`,
  });

  useEffect(() => {
    if (!socket || !lobbyId || !self) return;

    const joinMessage: LobbyEventMessage<LobbyEvent.UserJoined> = {
      event: LobbyEvent.UserJoined,
      data: {
        user: {
          id: self.id,
          username: self.username!,
          isHost: false,
          imgUrl: self.imageUrl,
        },
      },
    };
    socket.send(JSON.stringify(joinMessage));

    const onMessage = (event: WebSocketEventMap["message"]) => {
      const msg = JSON.parse(event.data);
      console.log(`Recieved ${msg.event}`);

      switch (msg.event) {
        case LobbyEvent.UserJoined:
          {
            const user = (msg as LobbyEventMessage<LobbyEvent.UserJoined>).data
              .user;
            addUser(user);
          }
          break;
        case LobbyEvent.UserLeft:
          {
            const id = (msg as LobbyEventMessage<LobbyEvent.UserLeft>).data.id;
            removeUser(id);
          }
          break;
      }
    };

    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, [socket, lobbyId, self]);

  return socket;
};
