import mongoose, { ObjectId, Schema } from "mongoose";

export type LobbyUser = {
  id: string;
  username: string;
  isHost: boolean;
};

export const userSchema = new Schema<LobbyUser>({
  username: { type: String, required: true },
  isHost: { type: Boolean, required: true, default: false },
});

const UserModel =
  mongoose.models.LobbyUser || mongoose.model("LobbyUser", userSchema);

export default UserModel;
