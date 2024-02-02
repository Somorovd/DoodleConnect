"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useLobby } from "@/hooks/use-lobby";
import { redirect } from "next/navigation";
import LobbyCanvas from "@/components/lobby/lobby-canvas";
import { useUser } from "@clerk/nextjs";

import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import LobbyVideoConference from "@/components/lobby/lobby-video-conference";
import { Track } from "livekit-client";
import { LobbyTrackToggle } from "@/components/lobby/lobby-track-toggle";

const LobbyPage = ({ params }: { params: { id: string } }) => {
  const { lobby, fetchLobby, loading, resetLoading } = useLobby();
  const [icon, setIcon] = useState<"copy" | "check">("copy");
  const [token, setToken] = useState("");
  const { user: self } = useUser();

  useEffect(() => {
    resetLoading();
  }, [params.id]);

  useEffect(() => {
    if (loading === "idle") {
      fetchLobby(params.id);
    }

    if (!self) return;

    if (loading === "complete") {
      if (!lobby?.users.find((user) => user.id === self.id)) {
        return redirect("/");
      }
    }
  }, [loading, lobby, self]);

  useEffect(() => {
    // livekit
    if (!lobby || !self) return;
    (async () => {
      try {
        const resp = await fetch(
          `/api/get-participant-token?room=${lobby._id}&username=${self.id}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [lobby, self]);

  const toggleCopy = () => {
    setIcon("check");
    setTimeout(() => setIcon("copy"), 1500);
  };

  return (
    <>
      <div className="flex gap-4 justify-center py-8 text-lg">
        {loading === "complete" ? (
          <>
            <p>
              Share your invite code:{" "}
              <span className="font-bold">
                {lobby?.inviteCode ||
                  "___________________________________________"}
              </span>
            </p>
            <span onClick={toggleCopy} className="hover:cursor-pointer">
              {icon === "copy" ? (
                <Copy
                  width={16}
                  onClick={() =>
                    navigator.clipboard.writeText(lobby?.inviteCode || "")
                  }
                />
              ) : (
                <Check width={16} />
              )}
            </span>
          </>
        ) : (
          <p>
            Finding Lobby: <span className="font-bold">{params.id}</span>
          </p>
        )}
      </div>
      {loading === "complete" ? (
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme=""
          style={{ height: "100dvh" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex space-x-9">
              <LobbyTrackToggle
                source={Track.Source.Microphone}
                showIcon={true}
              />
              <LobbyTrackToggle source={Track.Source.Camera} showIcon={true} />
            </div>
            <div className="grid grid-cols-[200_600_200] grid-rows-4 gap-4">
              <LobbyVideoConference />
              <RoomAudioRenderer />
              <div className="col-start-2 row-start-1 row-end-[-1]">
                <LobbyCanvas />
              </div>
            </div>
          </div>
        </LiveKitRoom>
      ) : null}
    </>
  );
};

export default LobbyPage;
