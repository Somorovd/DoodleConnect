import connectMongoDB from "@/lib/mongodb";
import LobbyModel, { Lobby } from "@/models/lobby";
import { LobbyUser } from "@/models/user";
import mongoose from "mongoose";

export async function PUT(
  req: Request,
  { params }: { params: { credential: string } }
) {
  const { credential } = params;
  const { user }: { user: LobbyUser } = await req.json();

  try {
    await connectMongoDB();
    let lobby: Lobby | null = null;
    
    if (mongoose.Types.ObjectId.isValid(credential)) {
      lobby = await LobbyModel.findByIdAndUpdate(credential, {
        $pull: {
          users: { id: user.id },
        },
      });
    } else {
      lobby = await LobbyModel.findOne(
        { inviteCode: credential },
        {
          $pull: {
            users: { id: user.id },
          },
        }
      );
    }

    if (!lobby) {
      return Response.json({ message: "Lobby not found" }, { status: 404 });
    }

    return Response.json(lobby, { status: 200 });
  } catch (e) {
    console.log("Error leaving lobby", e);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
