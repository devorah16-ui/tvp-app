"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const scripts = {
  atelier: {
    title: "Atelier Script",
    category: "Luxury Portrait Experience",
    description:
      "Guided language for women, mothers, and editorial-style portrait experiences.",
    content: `Opening:
“I’m so glad you reached out. A lot of my clients begin right here — knowing they want something meaningful, but not necessarily knowing exactly what the process looks like yet.”

Guiding the Experience:
“My role is to guide you through it in a way that feels easy and thoughtful. From styling to the session itself to choosing what you love afterward, I walk with you through each step so it never feels overwhelming.”

Positioning the Value:
“This experience is designed to create something that feels deeply personal and beautifully finished — not just images on a screen, but artwork that holds meaning for you.”

Soft Next Step:
“If it would be helpful, I can walk you through what the experience typically looks like and help you decide whether it feels like the right fit for what you’re envisioning.”`,
  },

  heirloom: {
    title: "Heirloom Script",
    category: "Family + Children + Milestone Portraits",
    description:
      "Refined, warm language focused on preserving meaningful moments with a timeless finish.",
    content: `Opening:
“Thank you so much for reaching out. These are the kinds of moments that pass quickly, and I love helping families preserve them in a way that feels beautiful and lasting.”

Guiding the Experience:
“I keep the process simple and guided so you don’t have to figure everything out on your own. My goal is to make this feel easy while still creating something truly special.”

Positioning the Value:
“What I create is meant to live beyond the moment itself — as portraits and artwork that hold onto this season for you in a meaningful way.”

Soft Next Step:
“If you’d like, I can walk you through what the session experience looks like and help you see what would make the most sense for your family.”`,
  },

  discovery: {
    title: "Discovery Call Script",
    category: "Consultation + Client Guidance",
    description:
      "Conversation flow for helping clients feel understood, supported, and gently guided.",
    content: `Start the Call:
“I’m so glad we could connect. Before we talk through details, I’d love to hear what’s been on your heart and what made you start thinking about doing this now.”

Discovery Questions:
- “What are you hoping these portraits will feel like?”
- “Who are they most for?”
- “What feels most important about this season right now?”
- “Have you done something like this before, or would this be a first?”

Guide, Don’t Pitch:
“That helps so much. Based on what you’re describing, I can already see how we could shape this in a way that feels really true to you.”

Transition:
“What I’d love to do is walk you through how the experience works so you can get a clear sense of what it would feel like from start to finish.”

Close Gently:
“If it feels aligned, the next step would simply be choosing a date and moving into the planning process together.”`,
  },

  objections: {
    title: "Objection Handling",
    category: "Reassurance + Decision Support",
    description:
      "Thoughtful responses for hesitation around price, spouse, timing, and overwhelm.",
    content: `Price Concern:
“I completely understand that. Most clients aren’t ready to make a decision the moment they first reach out — they simply want clarity first. My role is to help you understand the experience so you can decide from a place that feels calm and informed.”

Spouse / Partner Concern:
“That makes complete sense. This is something meaningful, and I would want you both to feel good about it. I’m happy to give you a simple overview you can share, and if it’s helpful, I’m always glad to answer questions.”

Overwhelm:
“I completely understand. That’s actually why I guide the process so closely — so you don’t feel like you have to figure everything out ahead of time.”

Timing:
“That makes sense too. Sometimes the best next step is simply getting clarity now, and then deciding on timing once it feels right.”`,
  },

  booking: {
    title: "Booking + Next Step",
    category: "Moving Forward",
    description:
      "Clear but elegant language for helping clients take the next step without pressure.",
    content: `Affirm the Fit:
“Based on everything you’ve shared, this feels like it could be a beautiful fit.”

Make the Next Step Feel Easy:
“The next step is very simple — we would choose your date, and then I guide you through the planning from there.”

Reassure:
“You do not need to have everything figured out before moving forward. That’s exactly what I’m here for.”

Invite:
“If you’re ready, I can help you reserve a date and send over the next details so everything feels clear and easy.”`,
  },
};

type ScriptKey = keyof typeof scripts;

const COACHING_PREFILL_KEY = "tvp-coaching-prefill";

type AdaptResult = {
  adaptedResponse: string;
  whyItFits: string;
};

export default function ScriptsPage() {
  const router = useRouter();
  const [selectedScript, setSelectedScript] = useState<ScriptKey>("atelier");
  const [clientMessage, setClientMessage] = useState("");
  const [adaptResult, setAdaptResult] = useState<AdaptResult | null>(null);
  const [loading, setLoading] = useState(false);

  const activeScript = scripts[selectedScript];

  async function handleCopy() {
    await navigator.clipboard.writeText(activeScript.content);
    alert("Script copied.");
  }

  function handleUseInCoaching() {
    const contentToUse =
      adaptResult?.adaptedResponse?.trim() || activeScript.content;

    localStorage.setItem(
      COACHING_PREFILL_KEY,
      JSON.stringify({
        title: activeScript.title,
        content: contentToUse,
      })
    );

    router.push("/testing");
  }

  async function handleAdapt() {
    if (!clientMessage.trim()) {
      alert("Paste a client message first.");
      return;
    }

    setLoading(true);
    setAdaptResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "adapt-script",
          clientMessage: "adapt-script-request",
          scriptTitle: activeScript.title,
          scriptContent: activeScript.content,
          clientMessageForAdaptation: clientMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Adaptation failed.");
      }

      setAdaptResult({
        adaptedResponse:
          data.adaptedResponse || "No adapted response returned.",
        whyItFits: data.whyItFits || "No explanation returned.",
      });
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while adapting the script."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-950 text-white px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-stone-400">
            Texas Vogue
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Script Library
          </h1>
          <p className="mt-4 max-w-2xl text-stone-300">
            Keep your foundational guidance, objections, consultation language,
            and next-step phrasing in one place.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <section className="space-y-4">
            {(Object.entries(scripts) as [ScriptKey, (typeof scripts)[ScriptKey]][]).map(
              ([key, script]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedScript(key);
                    setAdaptResult(null);
                  }}
                  className={`w-full rounded-3xl border p-5 text-left transition ${
                    selectedScript === key
                      ? "border-stone-500 bg-stone-800/90"
                      : "border-stone-800 bg-stone-900/60 hover:border-stone-700"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-stone-400">
                    {script.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-medium">{script.title}</h2>
                  <p className="mt-3 text-stone-300">{script.description}</p>
                </button>
              )
            )}
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-stone-400">
                    {activeScript.category}
                  </p>
                  <h2 className="mt-2 text-3xl font-medium">
                    {activeScript.title}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className="rounded-2xl border border-stone-700 px-4 py-2 text-sm text-stone-200"
                  >
                    Copy Script
                  </button>

                  <button
                    onClick={handleUseInCoaching}
                    className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black"
                  >
                    Use in Coaching
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-stone-800 bg-stone-950/60 p-6">
                <p className="whitespace-pre-line leading-8 text-stone-100">
                  {activeScript.content}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <label className="mb-3 block text-sm uppercase tracking-[0.2em] text-stone-400">
                Client Message
              </label>

              <textarea
                value={clientMessage}
                onChange={(e) => setClientMessage(e.target.value)}
                placeholder="Paste a real client message here to adapt this script..."
                className="min-h-[180px] w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-4 text-base text-white outline-none"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleAdapt}
                  disabled={loading}
                  className="rounded-2xl bg-white px-5 py-3 font-medium text-black disabled:opacity-60"
                >
                  {loading ? "Adapting..." : "Adapt Script to Client"}
                </button>

                {adaptResult?.adaptedResponse ? (
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        adaptResult.adaptedResponse
                      );
                      alert("Adapted response copied.");
                    }}
                    className="rounded-2xl border border-stone-700 px-5 py-3 text-stone-200"
                  >
                    Copy Adapted Response
                  </button>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Adapted Response
              </h2>
              <p className="mt-4 whitespace-pre-line text-stone-100">
                {adaptResult?.adaptedResponse ||
                  "Your adapted response will appear here."}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <h2 className="text-sm uppercase tracking-[0.25em] text-stone-400">
                Why It Fits
              </h2>
              <p className="mt-4 text-stone-100">
                {adaptResult?.whyItFits ||
                  "A short explanation of why the adaptation fits this client will appear here."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}