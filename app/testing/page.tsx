"use client";

import { useEffect, useState } from "react";

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

type SavedResponse = {
  id: string;
  source: "dashboard" | "coaching" | "scripts";
  title: string;
  clientMessage: string;
  response: string;
  stage?: string;
  toneDirection?: string;
  riskLevel?: string;
  tags?: string[];
  createdAt: string;
};

const STORAGE_KEY = "tvp-response-library";
const COACHING_PREFILL_KEY = "tvp-coaching-prefill";

function parseCustomTags(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

export default function CoachingPage() {
  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioKey>("overwhelmed");
  const [loadedTitle, setLoadedTitle] = useState("");
  const [loadedType, setLoadedType] = useState("");
  const [loadedMessage, setLoadedMessage] = useState("");
  const [loadedCoaching, setLoadedCoaching] = useState("");
  const [yourResponse, setYourResponse] = useState("");
  const [customTags, setCustomTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(COACHING_PREFILL_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { title?: string; content?: string };
      if (parsed?.content) setYourResponse(parsed.content);
      localStorage.removeItem(COACHING_PREFILL_KEY);
    } catch (error) {
      console.error("Failed to load coaching prefill:", error);
    }
  }, []);

  function handleLoadScenario() {
    const scenario = scenarios[selectedScenario];
    setLoadedTitle(scenario.title);
    setLoadedType(scenario.type);
    setLoadedMessage(scenario.message);
    setLoadedCoaching(scenario.coaching);
    setEvaluation(null);
  }

  async function handleEvaluate() {
    if (!loadedMessage.trim()) {
      alert("Load a scenario first.");
      return;
    }

    if (!yourResponse.trim()) {
      alert("Write your response first.");
      return;
    }

    setLoading(true);
    setEvaluation(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "evaluate",
          clientMessage: "evaluation-request",
          clientMessageForEvaluation: loadedMessage,
          userResponse: yourResponse,
          coachingContext: loadedCoaching,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluation failed.");

      setEvaluation({
        score: data.score || "—",
        whatWorked: data.whatWorked || "No feedback returned.",
        whatToImprove: data.whatToImprove || "No feedback returned.",
        revisedResponse: data.revisedResponse || "No revised response returned.",
      });
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while evaluating the response."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setYourResponse("");
    setCustomTags("");
    setEvaluation(null);
  }

  function handleSave() {
    if (!loadedMessage.trim() || !evaluation?.revisedResponse) {
      alert("Evaluate a response first.");
      return;
    }

    const autoTags = [loadedType, "coaching"].filter(Boolean);
    const mergedTags = Array.from(
      new Set([...autoTags, ...parseCustomTags(customTags)])
    );

    const newItem: SavedResponse = {
      id: crypto.randomUUID(),
      source: "coaching",
      title: loadedTitle || "Coaching Response",
      clientMessage: loadedMessage,
      response: evaluation.revisedResponse,
      stage: loadedType,
      tags: mergedTags,
      createdAt: new Date().toISOString(),
    };

    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as SavedResponse[]) : [];
    existing.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    alert("Saved to Response Library.");
  }

  return (
    <main className="min-h-screen bg-[#171311] px-6 py-10 text-[#F3EDE6]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="font-display text-sm text-[#CBBFB3]">TEXAS VOGUE</p>
          <h1 className="mt-3 font-display text-4xl text-[#F3EDE6]">
            Coaching
          </h1>
          <p className="mt-4 max-w-2xl text-[#CBBFB3]">
            Practice real client situations, refine your language, and coach
            yourself before responding live.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-6">
              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-[#9D8F83]">
                Choose Coaching Scenario
              </label>

              <select
                value={selectedScenario}
                onChange={(e) =>
                  setSelectedScenario(e.target.value as ScenarioKey)
                }
                className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6]"
              >
                <option value="overwhelmed">Overwhelmed Lead</option>
                <option value="spouse">Spouse Hesitation</option>
                <option value="price">Price Hesitation</option>
                <option value="discovery">Discovery Call Practice</option>
              </select>

              <button
                onClick={handleLoadScenario}
                className="mt-4 rounded-2xl bg-[#C6A978] px-5 py-3 font-medium text-black transition hover:bg-[#D7BB8C]"
              >
                Load Scenario
              </button>
            </div>

            <div className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-6">
              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-[#9D8F83]">
                Your Response
              </label>

              <textarea
                value={yourResponse}
                onChange={(e) => setYourResponse(e.target.value)}
                placeholder="Write how you would respond to this client..."
                className="min-h-[220px] w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-4 text-base text-[#F3EDE6] outline-none placeholder:text-[#9D8F83]"
              />

              <label className="mb-3 mt-4 block text-sm uppercase tracking-[0.2em] text-[#9D8F83]">
                Custom Tags
              </label>

              <input
                type="text"
                value={customTags}
                onChange={(e) => setCustomTags(e.target.value)}
                placeholder="spouse, price, discovery"
                className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6] outline-none placeholder:text-[#9D8F83]"
              />

              <p className="mt-2 text-sm text-[#9D8F83]">
                Separate tags with commas.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleEvaluate}
                  disabled={loading}
                  className="rounded-2xl bg-[#C6A978] px-5 py-3 font-medium text-black transition hover:bg-[#D7BB8C] disabled:opacity-60"
                >
                  {loading ? "Evaluating..." : "Evaluate My Response"}
                </button>

                <button
                  onClick={handleClear}
                  className="rounded-2xl border border-[#4A3E36] px-5 py-3 text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
                >
                  Clear
                </button>

                <button
                  onClick={handleSave}
                  className="rounded-2xl border border-[#4A3E36] px-5 py-3 text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
                >
                  Save Revised Response
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            {[
              ["Scenario", loadedTitle || "No scenario loaded yet."],
              ["Coaching Type", loadedType || "Waiting..."],
              [
                "Client Message",
                loadedMessage || "Load a scenario to see the client message.",
              ],
              [
                "Coaching Note",
                loadedCoaching || "Coaching guidance will appear here.",
              ],
              ["Score", evaluation?.score || "Your score will appear here."],
              [
                "What Worked",
                evaluation?.whatWorked || "Feedback will appear here.",
              ],
              [
                "What To Improve",
                evaluation?.whatToImprove ||
                  "Improvement notes will appear here.",
              ],
              [
                "Revised Response",
                evaluation?.revisedResponse ||
                  "A revised response will appear here.",
              ],
            ].map(([title, value]) => (
              <div
                key={title}
                className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-5"
              >
                <h2 className="text-sm uppercase tracking-[0.25em] text-[#9D8F83]">
                  {title}
                </h2>
                <p className="mt-3 whitespace-pre-line text-[#F3EDE6]">
                  {value}
                </p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}