import connectMongoDB from "@/lib/mongodb";
import LobbyModel from "@/models/lobby";
import { currentUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    const lobby = new LobbyModel({
      inviteCode: uuidv4(),
      users: [
        {
          id: user.id,
          username: user.username,
          isHost: true,
          imgUrl: user.imageUrl,
        },
      ],
    });

    await connectMongoDB();
    await lobby.save();
    return Response.json(lobby, { status: 201 });
  } catch (e) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
