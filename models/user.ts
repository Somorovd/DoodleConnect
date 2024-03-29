import mongoose, { ObjectId, Schema } from "mongoose";

export type LobbyUser = {
  id: string;
  username: string;
  isHost: boolean;
  imgUrl: string;
};

export const userSchema = new Schema<LobbyUser>({
  id: { type: String, required: true },
  username: { type: String, required: true },
  isHost: { type: Boolean, required: true, default: false },
  imgUrl: { type: String },
});

const UserModel =
  mongoose.models.LobbyUser || mongoose.model("LobbyUser", userSchema);

export default UserModel;
