import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User as UserModel } from "@/models/user.model";
import { connectDB } from "@/lib/dbConfig";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userID = user._id;
  try {
    const { acceptMessages } = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "fail to update user status to accept messages",
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "message acceptance status updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("fail to update user status to accept messages", error);
    return NextResponse.json(
      {
        success: false,
        message: "fail to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userID = user._id;
  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: user.isAcceptingMessage,
        message: "accepting messages status received",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("fail to update user status to accept messages", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching message acceptance status",
      },
      { status: 500 }
    );
  }
}
