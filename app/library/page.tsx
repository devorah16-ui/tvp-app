"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function ResponseLibraryPage() {
  const [items, setItems] = useState<SavedResponse[]>([]);
  const [sourceFilter, setSourceFilter] = useState<
    "all" | "dashboard" | "coaching" | "scripts"
  >("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const stageOptions = useMemo(() => {
    return Array.from(
      new Set(
        items
          .map((item) => item.stage?.trim())
          .filter((stage): stage is string => Boolean(stage))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const tagOptions = useMemo(() => {
    return Array.from(
      new Set(
        items.flatMap((item) =>
          (item.tags || []).map((tag) => tag.trim()).filter(Boolean)
        )
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSource =
        sourceFilter === "all" ? true : item.source === sourceFilter;

      const matchesStage =
        stageFilter === "all" ? true : item.stage === stageFilter;

      const matchesTag =
        tagFilter === "all" ? true : (item.tags || []).includes(tagFilter);

      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.clientMessage.toLowerCase().includes(search) ||
        item.response.toLowerCase().includes(search) ||
        (item.stage || "").toLowerCase().includes(search) ||
        (item.toneDirection || "").toLowerCase().includes(search) ||
        (item.riskLevel || "").toLowerCase().includes(search) ||
        (item.tags || []).some((tag) => tag.toLowerCase().includes(search));

      return matchesSource && matchesStage && matchesTag && matchesSearch;
    });
  }, [items, sourceFilter, stageFilter, tagFilter, searchTerm]);

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

  function handleResetFilters() {
    setSourceFilter("all");
    setStageFilter("all");
    setTagFilter("all");
    setSearchTerm("");
  }

  return (
    <main className="min-h-screen bg-stone-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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

          <button
            onClick={handleClearAll}
            className="rounded-2xl border border-stone-700 px-5 py-3 text-stone-200"
          >
            Clear All
          </button>
        </div>

        <div className="mb-8 grid gap-4 rounded-3xl border border-stone-800 bg-stone-900/60 p-6 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-400">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search responses..."
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-400">
              Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) =>
                setSourceFilter(
                  e.target.value as "all" | "dashboard" | "coaching" | "scripts"
                )
              }
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-white"
            >
              <option value="all">All Sources</option>
              <option value="dashboard">Dashboard</option>
              <option value="coaching">Coaching</option>
              <option value="scripts">Scripts</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-400">
              Stage / Category
            </label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-white"
            >
              <option value="all">All Stages</option>
              {stageOptions.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-stone-400">
              Tag
            </label>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-white"
            >
              <option value="all">All Tags</option>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full rounded-2xl border border-stone-700 px-5 py-3 text-stone-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="mb-6 text-sm text-stone-400">
          Showing {filteredItems.length} of {items.length} saved response
          {items.length === 1 ? "" : "s"}.
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8 text-stone-300">
            No saved responses match your filters.
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
                        {item.source === "dashboard"
                          ? "Dashboard"
                          : item.source === "coaching"
                          ? "Coaching"
                          : "Scripts"}
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

                  {(item.tags || []).length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags!.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-stone-700 px-3 py-1 text-xs text-stone-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                        Stage / Category
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