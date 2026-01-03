import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
export const sendVerificationEmail = async (
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Feedback Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "verification email sent successfully" };
  } catch (error) {
    console.log("error sending verification email", error);
    return { success: false, message: "failed to send verification email" };
  }
};
