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
    const user = await currentUser();

    if (!user) {
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

    return Response.json(lobby, { status: 200 });
  } catch (e) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
