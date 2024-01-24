"use client";

import { Button } from "@/components/ui/button";
import { ModalType, useModal } from "@/hooks/use-modal";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const onOpen = useModal((state) => state.onOpen);
  const { isLoaded, user: self } = useUser();

  const handleCreate = () => {
    onOpen(ModalType.CreateLobby);
  };

  const handleJoin = () => {
    onOpen(ModalType.JoinLobby);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <h1 className="text-[4rem] text-center">
        A Fake Artist Goes to New York
      </h1>
      <div className="h-screen flex justify-center m-[4rem]">
        <div className="w-[500px] h-[400px] border-[1px] space-y-4 p-4 border-black flex flex-col">
          <header className="flex text-center space-x-4">
            <UserButton afterSignOutUrl="/" />
            <p>
              Signed in as <span className="font-bold">{self?.username}</span>
            </p>
          </header>
          <hr className="border-black" />
          <div className="flex space-x-4 basis-full grow">
            <div className="h-full basis-0.5 grow rounded-none flex flex-col justify-between text-center">
              <h2>Create New Lobby</h2>
              <Button onClick={handleCreate}>Create</Button>
            </div>
            <div className="h-full basis-0.5 grow rounded-none flex flex-col justify-between text-center">
              <h2>Join a Lobby</h2>
              <Button onClick={handleJoin}>Join</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
