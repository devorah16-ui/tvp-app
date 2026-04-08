"use client";

import { useEffect, useMemo, useState } from "react";

type SavedResponse = {
  id: string;
  source: "dashboard" | "coaching";
  title: string;
  clientMessage: string;
  response: string;
  stage?: string;
  toneDirection?: string;
  riskLevel?: string;
  createdAt: string;
};

const STORAGE_KEY = "tvp-response-library";

export default function ResponseLibraryPage() {
  const [items, setItems] = useState<SavedResponse[]>([]);
  const [filter, setFilter] = useState<"all" | "dashboard" | "coaching">("all");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as SavedResponse[];
      setItems(parsed);
    } catch (error) {
      console.error("Failed to read response library:", error);
    }
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.source === filter);
  }, [items, filter]);

  function handleDelete(id: string) {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleClearAll() {
    if (!confirm("Clear all saved responses?")) return;
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    alert("Response copied.");
  }

  return (
    <main className="min-h-screen bg-stone-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-stone-400">
              Texas Vogue
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Response Library
            </h1>
            <p className="mt-4 max-w-2xl text-stone-300">
              Save, review, and reuse your strongest client responses.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "dashboard" | "coaching")
              }
              className="rounded-2xl border border-stone-700 bg-stone-900 px-4 py-3 text-white"
            >
              <option value="all">All Sources</option>
              <option value="dashboard">Dashboard</option>
              <option value="coaching">Coaching</option>
            </select>

            <button
              onClick={handleClearAll}
              className="rounded-2xl border border-stone-700 px-5 py-3 text-stone-200"
            >
              Clear All
            </button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8 text-stone-300">
            No saved responses yet.
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredItems
              .slice()
              .reverse()
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-stone-400">
                        {item.source === "dashboard" ? "Dashboard" : "Coaching"}
                      </p>
                      <h2 className="mt-2 text-2xl font-medium">{item.title}</h2>
                      <p className="mt-2 text-sm text-stone-400">
                        Saved {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCopy(item.response)}
                        className="rounded-2xl border border-stone-700 px-4 py-2 text-sm text-stone-200"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-2xl border border-stone-700 px-4 py-2 text-sm text-stone-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                        Stage
                      </p>
                      <p className="mt-2 text-stone-100">
                        {item.stage || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                        Tone
                      </p>
                      <p className="mt-2 text-stone-100">
                        {item.toneDirection || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                        Risk
                      </p>
                      <p className="mt-2 text-stone-100">
                        {item.riskLevel || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                        Client Message
                      </p>
                      <p className="mt-2 whitespace-pre-line text-stone-100">
                        {item.clientMessage}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                        Saved Response
                      </p>
                      <p className="mt-2 whitespace-pre-line text-stone-100">
                        {item.response}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}