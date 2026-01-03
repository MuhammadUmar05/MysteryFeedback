import { getServerSession } from "next-auth";
import { User as UserModel } from "@/models/user.model";
import { connectDB } from "@/lib/dbConfig";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userID = new mongoose.Types.ObjectId(session.user._id);

  const user = await UserModel.aggregate([
    { $match: { _id: userID } },
    { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
    { $sort: { "messages.createdAt": -1 } },
    { $group: { _id: "$_id", messages: { $push: "$messages" } } },
  ]);

  return NextResponse.json({
    success: true,
    messages: user[0]?.messages || [],
  });
}
