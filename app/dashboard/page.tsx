"use client";

import { useState } from "react";

const scenarios = {
  overwhelmed: {
    title: "Overwhelmed Lead",
    type: "Emotional Reassurance",
    message:
      "I love your work so much, but I’m honestly feeling a little overwhelmed and don’t know what I’d be committing to yet.",
    coaching:
      "This client needs simplicity, calm reassurance, and an easy next step. Avoid adding pressure or too many decisions too quickly.",
  },
  spouse: {
    title: "Spouse Hesitation",
    type: "Decision Support",
    message:
      "This is something I need to talk to my husband about first before I decide anything.",
    coaching:
      "Honor the decision-making process and keep the relationship warm. Avoid sounding like you are trying to close too quickly.",
  },
  price: {
    title: "Price Hesitation",
    type: "Value Coaching",
    message:
      "I’m interested, but I’m worried this may be more than I can spend right now.",
    coaching:
      "Do not defend pricing too quickly. Re-center the client on clarity, experience, and understanding the process before decisions are made.",
  },
  discovery: {
    title: "Discovery Call Practice",
    type: "Guided Conversation",
    message:
      "I want something special, but I’ve never done anything like this before, so I’m not really sure what to expect.",
    coaching:
      "Lead gently. Help the client feel safe, supported, and guided without making the conversation sound scripted.",
  },
};

type ScenarioKey = keyof typeof scenarios;

type EvaluationResult = {
  score: string;
  whatWorked: string;
  whatToImprove: string;
  revisedResponse: string;
};

export default function CoachingPage() {
  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioKey>("overwhelmed");
  const [loadedTitle, setLoadedTitle] = useState("");
  const [loadedType, setLoadedType] = useState("");
  const [loadedMessage, setLoadedMessage] = useState("");
  const [loadedCoaching, setLoadedCoaching] = useState("");
  const [yourResponse, setYourResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  function handleLoadScenario() {
    const scenario = scenarios[selectedScenario];
    setLoadedTitle(scenario.title);
    setLoadedType(scenario.type);
    setLoadedMessage(scenario.message);
    setLoadedCoaching(scenario.coaching);
    setYourResponse("");
    setEvaluation(null);
  }

  async function handleEvaluate() {
    if (!loadedMessage.trim() || !yourResponse.trim()) return;

    setLoading(true);
    setEvaluation(null);

    try {
      const prompt = `
You are a luxury client communication coach for Texas Vogue Photography.

Your job is to evaluate Deborah's draft response to a potential client.

Client message:
"${loadedMessage}"

Deborah's response:
"${yourResponse}"

Coaching context:
"${loadedCoaching}"

Brand voice rules:
- calm, confident, elevated
- warm but never salesy
- reassuring and guiding
- luxury, editorial, heirloom-focused
- never pushy
- natural, not generic
- clear, emotionally intelligent, and easy to follow

Evaluate the response and return only valid JSON in this exact shape:
{
  "score": "1-10",
  "whatWorked": "...",
  "whatToImprove": "...",
  "revisedResponse": "..."
}

Guidance:
- "score" should be a simple number from 1-10
- "whatWorked" should be concise but useful
- "whatToImprove" should be specific and constructive
- "revisedResponse" should sound like Deborah at her best
- the revised response should feel warm, natural, and luxurious without sounding scripted
`;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientMessage: prompt,
        }),
      });

      const data = await res.json();

      setEvaluation({
        score: data.score || "—",
        whatWorked: data.whatWorked || "No feedback returned.",
        whatToImprove: data.whatToImprove || "No feedback returned.",
        revisedResponse: data.revisedResponse || "No revised response returned.",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong while evaluating the response.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setYourResponse("");
    setEvaluation(null);
  }

  return (
    <main className="min-h-screen bg-stone-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-stone-400">
            Texas Vogue
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Coaching
          </h1>
          <p className="mt-4 max-w-2xl text-stone-300">
            Practice real client situations, refine your language, and coach
            yourself before responding live.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-stone-400">
                Choose Coaching Scenario
              </label>

              <select
                value={selectedScenario}
                onChange={(e) =>
                  setSelectedScenario(e.target.value as ScenarioKey)
                }
                className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-white"
              >
                <option value="overwhelmed">Overwhelmed Lead</option>
                <option value="spouse">Spouse Hesitation</option>
                <option value="price">Price Hesitation</option>
                <option value="discovery">Discovery Call Practice</option>
              </select>

              <button
                onClick={handleLoadScenario}
                className="mt-4 rounded-2xl bg-white px-5 py-3 font-medium text-black"
              >
                Load Scenario
              </button>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-stone-400">
                Your Response
              </label>

              <textarea
                value={yourResponse}
                onChange={(e) => setYourResponse(e.target.value)}
                placeholder="Write how you would respond to this client..."
                className="min-h-[220px] w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-4 text-base text-white outline-none"
              />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleEvaluate}
                  disabled={loading}
                  className="rounded-2xl bg-white px-5 py-3 font-medium text-black disabled:opacity-60"
                >
                  {loading ? "Evaluating..." : "Evaluate My Response"}
                </button>

                <button
                  onClick={handleClear}
                  className="rounded-2xl border border-stone-700 px-5 py-3 text-stone-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Scenario
              </h2>
              <p className="mt-3 text-lg">
                {loadedTitle || "No scenario loaded yet."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Coaching Type
              </h2>
              <p className="mt-3 text-lg">{loadedType || "Waiting..."}</p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Client Message
              </h2>
              <p className="mt-3 whitespace-pre-line text-stone-100">
                {loadedMessage || "Load a scenario to see the client message."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Coaching Note
              </h2>
              <p className="mt-3 text-stone-100">
                {loadedCoaching || "Coaching guidance will appear here."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Score
              </h2>
              <p className="mt-3 text-lg">
                {evaluation?.score || "Your score will appear here."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                What Worked
              </h2>
              <p className="mt-3 text-stone-100">
                {evaluation?.whatWorked || "Feedback will appear here."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                What To Improve
              </h2>
              <p className="mt-3 text-stone-100">
                {evaluation?.whatToImprove || "Improvement notes will appear here."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Revised Response
              </h2>
              <p className="mt-3 whitespace-pre-line text-stone-100">
                {evaluation?.revisedResponse ||
                  "A revised response will appear here."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}