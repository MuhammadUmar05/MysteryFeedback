import { User } from "@/models/user.model";
import { connectDB } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await User.findOne({ username: decodedUsername });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: "user verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return NextResponse.json(
        {
          success: false,
          message: "verification code is wrong. please enter the correct code",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            "verification code has expired. please signup again to get a new code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("error with verifying code", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
