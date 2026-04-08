import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clientMessage = body.clientMessage ?? "";
    const mode = body.mode ?? "analyze";

    if (!clientMessage.trim()) {
      return NextResponse.json(
        { error: "Client message is required." },
        { status: 400 }
      );
    }

    if (mode === "evaluate") {
      const prompt = `
You are a luxury client communication coach for Texas Vogue Photography.

Your job is to evaluate Deborah's draft response to a potential client.

Client message:
"${body.clientMessageForEvaluation ?? ""}"

Deborah's response:
"${body.userResponse ?? ""}"

Coaching context:
"${body.coachingContext ?? ""}"

Brand voice rules:
- calm, confident, elevated
- warm but never salesy
- reassuring and guiding
- luxury, editorial, heirloom-focused
- never pushy
- natural, not generic
- clear, emotionally intelligent, and easy to follow

Evaluation guidance:
- Score the response from 1 to 10
- Reward warmth, clarity, emotional attunement, confidence, and guidance
- Penalize pressure, generic language, defensiveness, overexplaining, or weak next steps
- "whatWorked" should be concise and specific
- "whatToImprove" should be constructive and practical
- "revisedResponse" should sound like Deborah at her best: refined, warm, calm, natural, and confident
- The revised response should feel helpful and human, not scripted

Return only valid JSON with this exact shape:
{
  "score": "1-10",
  "whatWorked": "...",
  "whatToImprove": "...",
  "revisedResponse": "..."
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
    }

    const prompt = `
You are the Texas Vogue AI Concierge for a luxury fine-art portrait studio.

Your job is to analyze a client message and return a JSON object with:
- emotionalNeed
- decisionStage
- response
- nextQuestion
- whatToAvoid
- toneDirection
- riskLevel

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
- Avoid repetitive phrasing like "I’m so glad you reached out" unless contextually natural
- Vary sentence structure to avoid sounding templated
- Use natural conversational flow, not scripts
- Prioritize clarity, ease, and emotional safety
- Gently lead toward a next step without pressure

Decision stage options:
- Exploring
- Interested
- Overwhelmed
- Cautious
- Collaborative
- Ready

Decision stage guidance:
- Exploring = just starting to consider the idea
- Interested = emotionally drawn in but still unsure
- Overwhelmed = interested but feeling pressure, uncertainty, or too many unknowns
- Cautious = worried about value, pricing, timing, or whether it is the right decision
- Collaborative = wants input from spouse, partner, or family before moving forward
- Ready = emotionally aligned and likely open to next steps

Risk level options:
- Low
- Medium
- High

For "whatToAvoid", give one short coaching note about what Deborah should avoid saying or doing in her reply.

For "toneDirection", give one short phrase describing the best tone to use in the reply.
Examples:
- Gentle reassurance
- Calm guidance
- Confident clarity
- Soft encouragement
- Warm direction

For "riskLevel", estimate the chance of losing the lead if the reply is mishandled.

Important response guidance:
- The "response" should sound like Deborah herself: refined, warm, natural, and emotionally intelligent
- Do not sound robotic, generic, or overly formal
- Do not over-explain
- Do not pressure the client
- The "nextQuestion" should feel easy and low-pressure, not salesy
- The "whatToAvoid" should be practical and specific
- The "toneDirection" should be short, clear, and useful
- The "riskLevel" should be only one of: Low, Medium, High
- The "decisionStage" should be only one of: Exploring, Interested, Overwhelmed, Cautious, Collaborative, Ready

Analyze this client message:

"${clientMessage}"

Return only valid JSON with this exact shape:
{
  "emotionalNeed": "...",
  "decisionStage": "Exploring | Interested | Overwhelmed | Cautious | Collaborative | Ready",
  "response": "...",
  "nextQuestion": "...",
  "whatToAvoid": "...",
  "toneDirection": "...",
  "riskLevel": "Low | Medium | High"
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
      { error: "Something went wrong while processing the request." },
      { status: 500 }
    );
  }
}