import connectMongoDB from "@/lib/mongodb";
import LobbyModel, { Lobby } from "@/models/lobby";
import { currentUser } from "@clerk/nextjs";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { credential: string } }
) {
  const { credential } = params;

  try {
    const self = await currentUser();

    if (!self) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectMongoDB();
    let lobby: Lobby | null = null;

    if (mongoose.Types.ObjectId.isValid(credential)) {
      lobby = await LobbyModel.findById(credential);
    } else {
      lobby = await LobbyModel.findOne({ inviteCode: credential });
    }

    if (!lobby) {
      return Response.json({ message: "Lobby not found" }, { status: 404 });
    }

    if (!lobby.users.find((user) => user.id === self.id)) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    return Response.json(lobby, { status: 200 });
  } catch (e) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { credential: string } }
) {
  const { credential } = params;

  try {
    await connectMongoDB();
    let lobby: Lobby | null = null;

    lobby = await LobbyModel.findById(credential);

    if (!lobby) {
      return Response.json({ message: "Lobby not found" }, { status: 404 });
    }

    await LobbyModel.findByIdAndDelete(credential);
    return Response.json({ message: "Successfully deleted" }, { status: 200 });
  } catch (e) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
