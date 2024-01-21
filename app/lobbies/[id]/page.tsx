"use client";

import React, { useEffect, useState } from "react";
import UsersList from "@/components/lobby/users-list";
import { Check, Copy } from "lucide-react";
import { useLobby } from "@/hooks/use-lobby";
import { useRouter } from "next/navigation";
import { useLobbySocket } from "@/hooks/use-lobby-socket";

const LobbyPage = ({ params }: { params: { id: string } }) => {
  const { lobby, fetchLobby, loading, resetLoading } = useLobby();
  const [icon, setIcon] = useState<"copy" | "check">("copy");
  const router = useRouter();
  const socket = useLobbySocket();

  useEffect(() => {
    resetLoading();
  }, [params.id]);

  useEffect(() => {
    if (loading === "idle") {
      fetchLobby(params.id);
    }
  }, [loading]);

  const toggleCopy = () => {
    setIcon("check");
    setTimeout(() => setIcon("copy"), 1500);
  };

  if (loading === "complete" && !lobby) {
    return router.push("/");
  }

  return (
    <>
      <div>LobbyPage - {params.id}</div>
      <div className="flex gap-4">
        Code - {lobby?.inviteCode || "loading..."}
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
      </div>
      <UsersList />
    </>
  );
};

export default LobbyPage;
