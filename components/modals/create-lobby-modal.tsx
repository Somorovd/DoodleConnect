"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ModalType, useModal } from "@/hooks/use-modal";
import { Lobby } from "@/models/lobby";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Slider } from "../ui/slider";

export function CreateLobbyModal() {
  const { isOpen, type, onClose } = useModal();
  const [isWaiting, setIsWaiting] = useState(false);
  const [maxUsers, setMaxUsers] = useState(8);
  const router = useRouter();

  useEffect(() => {
    setIsWaiting(false);
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsWaiting(true);
    const res = await fetch("/api/lobbies", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ maxUsers }),
    });
    const lobby: Lobby = await res.json();

    if (res.ok) {
      onClose();
      return router.push(`/lobbies/${lobby._id}`);
    } else {
      setIsWaiting(false);
    }
  };

  return (
    <Dialog
      open={isOpen && type === ModalType.CreateLobby}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Lobby</DialogTitle>
          <DialogDescription>
            Start and new lobby and get the invite code to share with your
            friends.
          </DialogDescription>
        </DialogHeader>
        <p>Users: {maxUsers}</p>
        <Slider
          value={[maxUsers]}
          min={1}
          max={8}
          onValueChange={(arr: number[]) => setMaxUsers(arr[0])}
        />
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isWaiting}>
            Go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
