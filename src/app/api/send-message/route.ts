import { Message, User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const { username, content } = await request.json();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "user is not accepting messages",
        },
        { status: 403 }
      );
    }

    const message = { content, createdAt: new Date() };
    user.messages.push(message as Message);
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error sending message to the user", error);
    return NextResponse.json(
      {
        success: false,
        message: "error sending message to the user",
      },
      { status: 500 }
    );
  }
}
