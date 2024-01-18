import React from "react";
import { CreateLobbyModal } from "../modals/create-lobby-modal";
import { JoinLobbyModal } from "../modals/join-lobby-modal";

const ModalProvider = () => {
  return (
    <>
      <CreateLobbyModal />
      <JoinLobbyModal />
    </>
  );
};

export default ModalProvider;
