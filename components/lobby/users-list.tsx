"use client";

import { useLobby } from "@/hooks/use-lobby";
import React from "react";

const UsersList = () => {
  const users = useLobby((state) => state.users);

  return (
    <div>
      {Object.keys(users).map((id, i) => (
        <div key={`user-${id}`}>{users[id]?.username}</div>
      ))}
    </div>
  );
};

export default UsersList;
