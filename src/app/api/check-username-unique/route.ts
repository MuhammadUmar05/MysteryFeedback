import { User } from "@/models/user.model";
import { connectDB } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: "false",
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;
    const exisitngVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });

    if (exisitngVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Username validation error", error);
    return NextResponse.json(
      {
        success: "false",
        message: "error validating username",
      },
      {
        status: 500,
      }
    );
  }
}
