"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

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

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [authChecked, setAuthChecked] = useState(false);
  const [clientMessage, setClientMessage] = useState("");
  const [customTags, setCustomTags] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setAuthChecked(true);
    }

    checkUser();
  }, [router, supabase]);

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

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Something went wrong."
      );
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
    setCustomTags("");
    setResult(null);
  }

  function handleSave() {
    if (!result?.response || !clientMessage.trim()) {
      alert("Analyze a message first.");
      return;
    }

    const autoTags = [
      result.decisionStage,
      result.riskLevel || "",
      result.toneDirection || "",
    ].filter(Boolean);

    const mergedTags = Array.from(
      new Set([...autoTags, ...parseCustomTags(customTags)])
    );

    const newItem: SavedResponse = {
      id: crypto.randomUUID(),
      source: "dashboard",
      title: `${result.decisionStage} Response`,
      clientMessage,
      response: result.response,
      stage: result.decisionStage,
      toneDirection: result.toneDirection,
      riskLevel: result.riskLevel,
      tags: mergedTags,
      createdAt: new Date().toISOString(),
    };

    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as SavedResponse[]) : [];
    existing.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    alert("Saved to Response Library.");
  }

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#171311] px-6 py-10 text-[#F3EDE6]">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-6 shadow-2xl">
            <p className="text-sm text-[#CBBFB3]">Checking access...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#171311] px-6 py-10 text-[#F3EDE6]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-[#F3EDE6]">
            Lead Analyzer
          </h1>
          <p className="mt-3 max-w-2xl text-[#CBBFB3]">
            Understand client intent, identify emotional drivers, and craft
            responses that feel clear, calm, and guided.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-6 shadow-2xl">
            <label className="mb-3 block text-sm font-medium text-[#F3EDE6]">
              Client Message
            </label>

            <textarea
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
              placeholder="Paste the client message here..."
              className="min-h-[220px] w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-4 text-base text-[#F3EDE6] outline-none placeholder:text-[#9D8F83]"
            />

            <label className="mb-3 mt-4 block text-sm font-medium text-[#F3EDE6]">
              Custom Tags
            </label>

            <input
              type="text"
              value={customTags}
              onChange={(e) => setCustomTags(e.target.value)}
              placeholder="spouse, hesitant, atelier"
              className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6] outline-none placeholder:text-[#9D8F83]"
            />

            <p className="mt-2 text-sm text-[#9D8F83]">
              Separate tags with commas.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="rounded-2xl bg-[#C6A978] px-5 py-3 font-medium text-black transition hover:bg-[#D7BB8C] disabled:opacity-60"
              >
                {loading ? "Analyzing..." : "Analyze Message"}
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
                Save to Library
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <InfoCard
              title="Emotional Need"
              value={result?.emotionalNeed || "Waiting for analysis..."}
            />
            <InfoCard
              title="Decision Stage"
              value={result?.decisionStage || "Waiting for analysis..."}
            />

            <div className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm uppercase tracking-[0.25em] text-[#9D8F83]">
                  Suggested Response
                </h2>
                <button
                  onClick={handleCopy}
                  className="rounded-xl border border-[#4A3E36] px-3 py-2 text-sm text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
                >
                  Copy
                </button>
              </div>

              <p className="mt-3 whitespace-pre-line text-[#F3EDE6]">
                {result?.response || "Your suggested response will appear here."}
              </p>

              {result?.debug ? (
                <p className="mt-2 text-xs text-[#9D8F83]">{result.debug}</p>
              ) : null}
            </div>

            <InfoCard
              title="Next Question"
              value={
                result?.nextQuestion ||
                "Your next guiding question will appear here."
              }
            />
            <InfoCard
              title="What To Avoid"
              value={result?.whatToAvoid || "Coaching guidance will appear here."}
            />
            <InfoCard
              title="Tone Direction"
              value={result?.toneDirection || "Tone guidance will appear here."}
            />
            <InfoCard
              title="Risk Level"
              value={result?.riskLevel || "Risk level will appear here."}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-5">
      <h2 className="text-sm uppercase tracking-[0.25em] text-[#9D8F83]">
        {title}
      </h2>
      <p className="mt-3 whitespace-pre-line text-[#F3EDE6]">{value}</p>
    </div>
  );
}