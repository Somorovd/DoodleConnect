"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lobby } from "@/models/lobby";
import { ModalType, useModal } from "@/hooks/use-modal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function JoinLobbyModal() {
  const { isOpen, type, onClose } = useModal();
  const [isWaiting, setIsWaiting] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsWaiting(false);
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsWaiting(true);
    const res = await fetch(`/api/lobbies/${inviteCode}`);
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
      open={isOpen && type === ModalType.JoinLobby}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Lobby</DialogTitle>
          <DialogDescription>
            Enter the invite code to be redirected to the target lobby.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="code">Invite Code</Label>
        <Input
          id="code"
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        ></Input>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isWaiting}>
            Go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
