"use client";

import { useEffect, useState } from "react";

const scenarioGroups = {
  overwhelmed: {
    label: "Overwhelmed Lead",
    scenarios: [
      {
        title: "Overwhelmed Lead 1",
        type: "Emotional Reassurance",
        message:
          "I love your work so much, but I’m honestly feeling a little overwhelmed and don’t know what I’d be committing to yet.",
        coaching:
          "This client needs simplicity, calm reassurance, and an easy next step. Avoid adding pressure or too many decisions too quickly.",
      },
      {
        title: "Overwhelmed Lead 2",
        type: "Emotional Reassurance",
        message:
          "This all looks beautiful, but I think I’m just a little overwhelmed trying to understand how it all works.",
        coaching:
          "Slow the pace down. Help her feel like she does not need to understand everything right now.",
      },
      {
        title: "Overwhelmed Lead 3",
        type: "Emotional Reassurance",
        message:
          "I’m interested, but I feel like I have too many questions and I’m not even sure where to start.",
        coaching:
          "Lead with clarity and relief. Do not answer everything at once. Give one simple next step.",
      },
      {
        title: "Overwhelmed Lead 4",
        type: "Emotional Reassurance",
        message:
          "I do want something meaningful, but I’m already juggling so much and don’t want this to become another stressful thing.",
        coaching:
          "Reassure her that your role is to make the process feel easy and fully guided.",
      },
      {
        title: "Overwhelmed Lead 5",
        type: "Emotional Reassurance",
        message:
          "I’ve never done anything like this before, and I think I’m just feeling a little intimidated by the whole process.",
        coaching:
          "Normalize her feelings and position yourself as a calm guide who will walk her through it.",
      },
    ],
  },

  spouse: {
    label: "Spouse Hesitation",
    scenarios: [
      {
        title: "Spouse Hesitation 1",
        type: "Decision Support",
        message:
          "This is something I need to talk to my husband about first before I decide anything.",
        coaching:
          "Honor the decision-making process and keep the relationship warm. Avoid sounding like you are trying to close too quickly.",
      },
      {
        title: "Spouse Hesitation 2",
        type: "Decision Support",
        message:
          "I really love this, but I’d need to talk it through with my husband before moving forward.",
        coaching:
          "Support the partnership. Offer clarity she can take back without making her feel pressured.",
      },
      {
        title: "Spouse Hesitation 3",
        type: "Decision Support",
        message:
          "It sounds beautiful, but I can’t make that kind of decision without talking to my spouse first.",
        coaching:
          "Respect the process. Give her a calm next step and language that makes it easier to continue the conversation later.",
      },
      {
        title: "Spouse Hesitation 4",
        type: "Decision Support",
        message:
          "I think I’d want to do this, but I know my husband is going to ask a lot of questions first.",
        coaching:
          "Make it easy for her to bring him into the conversation. Avoid defensiveness.",
      },
      {
        title: "Spouse Hesitation 5",
        type: "Decision Support",
        message:
          "Before I commit to anything, I really need to talk this over with my partner.",
        coaching:
          "Keep it open, warm, and low-pressure. Offer support without trying to force a decision.",
      },
    ],
  },

  price: {
    label: "Price Hesitation",
    scenarios: [
      {
        title: "Price Hesitation 1",
        type: "Value Coaching",
        message:
          "I’m interested, but I’m worried this may be more than I can spend right now.",
        coaching:
          "Do not defend pricing too quickly. Re-center the client on clarity, experience, and understanding the process before decisions are made.",
      },
      {
        title: "Price Hesitation 2",
        type: "Value Coaching",
        message:
          "Your work is beautiful, but I’m honestly nervous this may be out of my budget.",
        coaching:
          "Acknowledge the concern without collapsing into price talk too early.",
      },
      {
        title: "Price Hesitation 3",
        type: "Value Coaching",
        message:
          "I love the idea of this, but I’m not sure if it’s something I can justify financially.",
        coaching:
          "Keep the conversation centered on meaning and fit, not defense or discounting.",
      },
      {
        title: "Price Hesitation 4",
        type: "Value Coaching",
        message:
          "I’m very interested, but cost is definitely something I’m thinking hard about.",
        coaching:
          "Stay calm and grounded. Help her feel informed, not sold.",
      },
      {
        title: "Price Hesitation 5",
        type: "Value Coaching",
        message:
          "This feels like something I would love, but I’m worried I’ll fall in love with it and then realize I can’t afford it.",
        coaching:
          "Respond with emotional intelligence. Reduce fear and create clarity without sounding transactional.",
      },
    ],
  },

  discovery: {
    label: "Discovery Call Practice",
    scenarios: [
      {
        title: "Discovery Call 1",
        type: "Guided Conversation",
        message:
          "I want something special, but I’ve never done anything like this before, so I’m not really sure what to expect.",
        coaching:
          "Lead gently. Help the client feel safe, supported, and guided without making the conversation sound scripted.",
      },
      {
        title: "Discovery Call 2",
        type: "Guided Conversation",
        message:
          "I’ve been thinking about doing something meaningful with my daughter, but I don’t really know what the experience would look like.",
        coaching:
          "Draw her into the emotional vision while keeping the next step simple.",
      },
      {
        title: "Discovery Call 3",
        type: "Guided Conversation",
        message:
          "I know I want portraits that feel beautiful and timeless, but I don’t know where to start.",
        coaching:
          "Position yourself as the expert guide. Help her feel cared for, not overwhelmed.",
      },
      {
        title: "Discovery Call 4",
        type: "Guided Conversation",
        message:
          "I’ve never invested in something like this before, but I keep coming back to the idea.",
        coaching:
          "Acknowledge the pull she feels and help her explore it safely.",
      },
      {
        title: "Discovery Call 5",
        type: "Guided Conversation",
        message:
          "I think I want to do this, but I would need help understanding what the process feels like from start to finish.",
        coaching:
          "Offer a simple, elegant overview and reduce uncertainty.",
      },
    ],
  },
};

type ScenarioGroupKey = keyof typeof scenarioGroups;

type Scenario = {
  title: string;
  type: string;
  message: string;
  coaching: string;
};

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

function getRandomScenario(groupKey: ScenarioGroupKey): Scenario {
  const scenarios = scenarioGroups[groupKey].scenarios;
  const randomIndex = Math.floor(Math.random() * scenarios.length);
  return scenarios[randomIndex];
}

export default function CoachingPage() {
  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioGroupKey>("overwhelmed");
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

  function loadScenario(groupKey: ScenarioGroupKey) {
    const scenario = getRandomScenario(groupKey);
    setLoadedTitle(scenario.title);
    setLoadedType(scenario.type);
    setLoadedMessage(scenario.message);
    setLoadedCoaching(scenario.coaching);
    setEvaluation(null);
  }

  function handleLoadScenario() {
    loadScenario(selectedScenario);
  }

  function handleLoadAnother() {
    loadScenario(selectedScenario);
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

    const autoTags = [loadedType, "coaching", scenarioGroups[selectedScenario].label].filter(Boolean);
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
                Choose Coaching Category
              </label>

              <select
                value={selectedScenario}
                onChange={(e) =>
                  setSelectedScenario(e.target.value as ScenarioGroupKey)
                }
                className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6]"
              >
                <option value="overwhelmed">Overwhelmed Lead</option>
                <option value="spouse">Spouse Hesitation</option>
                <option value="price">Price Hesitation</option>
                <option value="discovery">Discovery Call Practice</option>
              </select>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleLoadScenario}
                  className="rounded-2xl bg-[#C6A978] px-5 py-3 font-medium text-black transition hover:bg-[#D7BB8C]"
                >
                  Load Scenario
                </button>

                <button
                  onClick={handleLoadAnother}
                  className="rounded-2xl border border-[#4A3E36] px-5 py-3 text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
                >
                  Load Another
                </button>
              </div>

              <p className="mt-3 text-sm text-[#9D8F83]">
                Each category contains multiple scenario variations.
              </p>
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