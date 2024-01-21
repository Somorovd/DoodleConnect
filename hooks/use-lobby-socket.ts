import usePartySocket from "partysocket/react";
import { useLobby } from "./use-lobby";
import { useEffect } from "react";
import { LobbyEvent, LobbyEventMessage } from "@/party/lobby";
import { useUser } from "@clerk/nextjs";

export const useLobbySocket = () => {
  const lobbyId = useLobby((state) => state.lobby?._id);
  const { user: self } = useUser();
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
    party: "lobby",
    room: `${lobbyId}`,
  });

  useEffect(() => {
    if (!socket || !lobbyId || !self) return;

    const onMessage = (event: WebSocketEventMap["message"]) => {};

    socket.addEventListener("message", onMessage);

    const joinMessage: LobbyEventMessage<LobbyEvent.UserJoined> = {
      event: LobbyEvent.UserJoined,
      data: {
        user: {
          id: self.id,
          username: self.username!,
          isHost: false,
        },
      },
    };
    socket.send(JSON.stringify(joinMessage));

    return () => socket.removeEventListener("message", onMessage);
  }, [socket, lobbyId, self]);

  return socket;
};
