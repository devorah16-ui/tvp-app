"use client";

import { useState } from "react";

type AnalyzeResult = {
  emotionalNeed: string;
  decisionStage: string;
  response: string;
  nextQuestion: string;
  whatToAvoid?: string;
  toneDirection?: string;
  riskLevel?: string;
  originalMessage?: string;
  debug?: string;
};

export default function DashboardPage() {
  const [clientMessage, setClientMessage] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!clientMessage.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientMessage }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result?.response) return;
    await navigator.clipboard.writeText(result.response);
    alert("Response copied.");
  }

  function handleClear() {
    setClientMessage("");
    setResult(null);
  }

  return (
    <main className="min-h-screen bg-stone-950 text-white px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-400">
            Texas Vogue
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Lead Analyzer</h1>
          <p className="mt-3 max-w-2xl text-stone-300">
            Analyze client language, identify emotional need, and generate a
            guided response in the Texas Vogue tone.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 shadow-2xl">
            <label className="mb-3 block text-sm font-medium text-stone-200">
              Client Message
            </label>

            <textarea
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
              placeholder="Paste the client message here..."
              className="min-h-[220px] w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-4 text-base text-white outline-none"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="rounded-2xl bg-white px-5 py-3 font-medium text-black disabled:opacity-60"
              >
                {loading ? "Analyzing..." : "Analyze Message"}
              </button>

              <button
                onClick={handleClear}
                className="rounded-2xl border border-stone-700 px-5 py-3 text-stone-200"
              >
                Clear
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Emotional Need
              </h2>
              <p className="mt-3 text-lg">
                {result && result.emotionalNeed
                  ? result.emotionalNeed
                  : "Waiting for analysis..."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Decision Stage
              </h2>
              <p className="mt-3 text-lg">
                {result && result.decisionStage
                  ? result.decisionStage
                  : "Waiting for analysis..."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                  Suggested Response
                </h2>
                <button
                  onClick={handleCopy}
                  className="rounded-xl border border-stone-700 px-3 py-2 text-sm text-stone-200"
                >
                  Copy
                </button>
              </div>
              <p className="mt-3 whitespace-pre-line text-stone-100">
                {result && result.response
                  ? result.response
                  : "Your suggested response will appear here."}
              </p>

              {result && result.debug ? (
                <p className="mt-2 text-xs text-stone-500">{result.debug}</p>
              ) : null}
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Next Question
              </h2>
              <p className="mt-3 text-stone-100">
                {result && result.nextQuestion
                  ? result.nextQuestion
                  : "Your next guiding question will appear here."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                What To Avoid
              </h2>
              <p className="mt-3 text-stone-100">
                {result && result.whatToAvoid
                  ? result.whatToAvoid
                  : "Coaching guidance will appear here."}
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Tone Direction
              </h2>
            <p className="mt-3 text-stone-100">
             {result && result.toneDirection
            ? result.toneDirection
            : "Tone guidance will appear here."}
             </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-5">
            <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
             Risk Level
            </h2>
           <p className="mt-3 text-stone-100">
            {result && result.riskLevel
           ? result.riskLevel
           : "Risk level will appear here."}
           </p>
           </div>
          </section>
        </div>
      </div>
    </main>
  );
}