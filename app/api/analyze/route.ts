import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clientMessage = body.clientMessage ?? "";

    if (!clientMessage.trim()) {
      return NextResponse.json(
        { error: "Client message is required." },
        { status: 400 }
      );
    }

    const prompt = `
You are the Texas Vogue AI Concierge for a luxury fine-art portrait studio.

Your job is to analyze a client message and return a JSON object with:
- emotionalNeed
- luStage
- response
- nextQuestion

Brand voice rules:
- calm, confident, elevated
- warm but never salesy
- luxury, editorial, heirloom-focused
- reassuring and guiding
- never pushy
- do not lead with discounts
- make the client feel taken care of
- responses should feel natural, not generic

LU stage options:
- Curious but early
- Interested but hesitant
- Overwhelmed
- Price-sensitive
- Needs spouse buy-in
- Ready to book

Analyze this client message:

"${clientMessage}"

Return only valid JSON with this exact shape:
{
  "emotionalNeed": "...",
  "luStage": "...",
  "response": "...",
  "nextQuestion": "..."
}
`;

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: prompt,
    });

    const text = response.output_text;

    if (!text) {
      return NextResponse.json(
        { error: "No output returned from model." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Analyze route error:", error);

    return NextResponse.json(
      { error: "Something went wrong while analyzing the message." },
      { status: 500 }
    );
  }
}