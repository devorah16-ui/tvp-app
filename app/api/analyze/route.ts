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
- whatToAvoid

Brand voice rules:
- calm, confident, elevated
- warm but never salesy
- luxury, editorial, heirloom-focused
- reassuring and guiding
- never pushy
- do not lead with discounts
- make the client feel taken care of
- responses should feel natural, not generic

Tone refinement:
- Speak as a trusted guide, not a salesperson
- Avoid repetitive phrasing like “I’m so glad you reached out” unless contextually natural
- Vary sentence structure to avoid sounding templated
- Use natural conversational flow, not scripts
- Prioritize clarity, ease, and emotional safety
- Gently lead toward a next step without pressure

LU stage options:
- Curious but early
- Interested but hesitant
- Overwhelmed
- Price-sensitive
- Needs spouse buy-in
- Ready to book

For "whatToAvoid", give one short coaching note about what Deborah should avoid saying or doing in her reply.

Analyze this client message:

"${clientMessage}"

Return only valid JSON with this exact shape:
{
  "emotionalNeed": "...",
  "luStage": "...",
  "response": "...",
  "nextQuestion": "...",
  "whatToAvoid": "..."
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
    parsed.debug = "live-ai-route";
    
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Analyze route error:", error);

    return NextResponse.json(
      { error: "Something went wrong while analyzing the message." },
      { status: 500 }
    );
  }
}
