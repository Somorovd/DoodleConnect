"use client";

import { Button } from "@/components/ui/button";
import { ModalType, useModal } from "@/hooks/use-modal";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const onOpen = useModal((state) => state.onOpen);

  const handleCreate = () => {
    onOpen(ModalType.CreateLobby);
  };

  const handleJoin = () => {
    onOpen(ModalType.JoinLobby);
  };

  return (
    <div className="h-screen">
      <UserButton afterSignOutUrl="/" />
      <Button onClick={handleCreate}>Create New Lobby</Button>
      <Button onClick={handleJoin}>Join a Lobby</Button>
    </div>
  );
}
