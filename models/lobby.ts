import mongoose, { ObjectId, Schema } from "mongoose";
import { LobbyUser, userSchema } from "./user";

export type Lobby = {
  _id: ObjectId | string;
  inviteCode: string;
  users: LobbyUser[];
};

export const lobbySchema = new Schema<Lobby>({
  inviteCode: { type: String, required: true },
  users: { type: [userSchema], required: true, default: [] },
});

const LobbyModel =
  mongoose.models.Lobby || mongoose.model("Lobby", lobbySchema);

export default LobbyModel;
