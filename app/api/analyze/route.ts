import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const clientMessage = body.clientMessage ?? "";

  return NextResponse.json({
    emotionalNeed: "Reassurance and clarity",
    luStage: "Interested but hesitant",
    response:
      "I’m so glad you reached out. A lot of my clients begin exactly here—wanting to understand what the experience feels like before making any decisions.",
    nextQuestion:
      "Would it help if I walked you through what the process looks like from start to finish?",
    originalMessage: clientMessage,
  });
}