import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User as UserModel } from "@/models/user.model";
import { connectDB } from "@/lib/dbConfig";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ messageid: string }> }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const { messageid } = await context.params;   
  const userId = new mongoose.Types.ObjectId(session.user._id as string);
  const messageId = new mongoose.Types.ObjectId(messageid);

  const updatedResult = await UserModel.updateOne(
    { _id: userId },
    { $pull: { messages: { _id: messageId } } }
  );

  if (updatedResult.modifiedCount === 0) {
    return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Message deleted" }, { status: 200 });
}


