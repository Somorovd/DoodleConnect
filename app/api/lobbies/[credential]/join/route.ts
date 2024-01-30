import connectMongoDB from "@/lib/mongodb";
import LobbyModel, { Lobby } from "@/models/lobby";
import { LobbyUser } from "@/models/user";
import { currentUser } from "@clerk/nextjs";
import mongoose from "mongoose";

export async function PUT(
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

    const newUser: LobbyUser = {
      id: user.id,
      username: user.username || "",
      isHost: false,
      imgUrl: user.imageUrl,
    };

    if (mongoose.Types.ObjectId.isValid(credential)) {
      lobby = await LobbyModel.findById(credential);
    } else {
      lobby = await LobbyModel.findOne({ inviteCode: credential });
    }

    if (!lobby) {
      return Response.json(
        { message: "This lobby cannot be joined" },
        { status: 404 }
      );
    }

    // user already in lobby
    if (lobby.users.find((user) => user.id === newUser.id)) {
      return Response.json(lobby, { status: 200 });
    }

    if (lobby.users.length === lobby.maxUsers) {
      return Response.json(
        { message: "This lobby cannot be joined" },
        { status: 400 }
      );
    }

    if (mongoose.Types.ObjectId.isValid(credential)) {
      lobby = await LobbyModel.findByIdAndUpdate(credential, {
        $push: { users: newUser },
      });
    } else {
      lobby = await LobbyModel.findOneAndUpdate(
        { inviteCode: credential },
        {
          $push: { users: newUser },
        }
      );
    }

    return Response.json(lobby, { status: 200 });
  } catch (e) {
    console.log("Error joining lobby", e);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
