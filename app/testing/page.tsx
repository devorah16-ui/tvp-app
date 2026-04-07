"use client";

import { useState } from "react";

const scenarios = {
  overwhelmed: {
    title: "Overwhelmed Lead",
    type: "Text Inquiry",
    message:
      "I love your work so much, but I’m honestly feeling a little overwhelmed and don’t know what I’d be committing to yet.",
    coaching:
      "This lead needs reassurance, simplicity, and a low-pressure next step. Do not rush into pricing or hard closing language.",
  },
  spouse: {
    title: "Spouse Hesitation",
    type: "Objection Handling",
    message:
      "This is something I need to talk to my husband about first before I decide anything.",
    coaching:
      "Acknowledge the importance of making the decision together. Keep the connection warm and offer a simple next step.",
  },
  price: {
    title: "Price Hesitation",
    type: "Objection Handling",
    message:
      "I’m interested, but I’m worried this may be more than I can spend right now.",
    coaching:
      "Do not become defensive. Reframe around experience, flexibility, and helping them understand the process before making decisions.",
  },
  discovery: {
    title: "Discovery Call Practice",
    type: "Discovery Call",
    message:
      "I want something special, but I’ve never done anything like this before, so I’m not really sure what to expect.",
    coaching:
      "Slow the conversation down. Guide the client through the experience and help them feel taken care of.",
  },
};

type ScenarioKey = keyof typeof scenarios;

export default function TestingPage() {
  const [selectedScenario, setSelectedScenario] =
    useState<ScenarioKey>("overwhelmed");
  const [loadedMessage, setLoadedMessage] = useState("");
  const [loadedCoaching, setLoadedCoaching] = useState("");
  const [loadedTitle, setLoadedTitle] = useState("");
  const [loadedType, setLoadedType] = useState("");

  function handleLoadScenario() {
    const scenario = scenarios[selectedScenario];
    setLoadedTitle(scenario.title);
    setLoadedType(scenario.type);
    setLoadedMessage(scenario.message);
    setLoadedCoaching(scenario.coaching);
  }

  return (
    <main className="min-h-screen bg-stone-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-stone-400">
            Texas Vogue
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Testing Panel
          </h1>
          <p className="mt-4 max-w-2xl text-stone-300">
            Practice lead scenarios, test responses, and refine how you guide
            clients through hesitation, overwhelm, and uncertainty.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
            <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-stone-400">
              Choose Scenario
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
          </section>

          <section className="space-y-4">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Scenario Title
              </h2>
              <p className="mt-3 text-lg">
                {loadedTitle || "No scenario loaded yet."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Scenario Type
              </h2>
              <p className="mt-3 text-lg">
                {loadedType || "Waiting..."}
              </p>
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
                {loadedCoaching || "Your coaching notes will appear here."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}