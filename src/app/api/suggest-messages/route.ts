import { NextRequest, NextResponse } from "next/server";
import { gemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const prompt:string =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      success: true,
      message: response.text || "No response from AI",
    });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { success: false, message: "AI service unavailable" },
      { status: 500 }
    );
  }
}
