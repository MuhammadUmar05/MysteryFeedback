import { User } from "@/models/user.model";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { connectDB } from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await User.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    const exisitngUserByEmail = await User.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (exisitngUserByEmail) {
      if (exisitngUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "user already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        exisitngUserByEmail.password = hashedPassword;
        const verifyCodeExpiry = new Date();
        verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);
        exisitngUserByEmail.verifyCode = verifyCode;
        exisitngUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
        await exisitngUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verifyCodeExpiry = new Date();
      verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );
    console.log("email sent route")
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "user registered successfully. please verify your email ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error registering user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
