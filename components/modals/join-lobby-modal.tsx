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
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsWaiting(false);
    setInviteCode("");
    setError("");
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsWaiting(true);

    if (!inviteCode) {
      setError("An invite code is required");
      setIsWaiting(false);
      return;
    }

    const res = await fetch(`/api/lobbies/${inviteCode}/join`, {
      method: "put",
    });

    if (res.ok) {
      const lobby: Lobby = await res.json();
      router.push(`/lobbies/${lobby._id}`);
      onClose();
    } else {
      const resBody = await res.json();
      setError(resBody.message || "An Error Occured");
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
        <p className="text-red-700">{error}</p>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isWaiting}>
            Go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
