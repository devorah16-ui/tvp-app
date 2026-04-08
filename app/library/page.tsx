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

function parseTags(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

export default function ResponseLibraryPage() {
  const [items, setItems] = useState<SavedResponse[]>([]);
  const [sourceFilter, setSourceFilter] = useState<
    "all" | "dashboard" | "coaching" | "scripts"
  >("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTags, setEditingTags] = useState("");

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

  function persistItems(next: SavedResponse[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleDelete(id: string) {
    const next = items.filter((item) => item.id !== id);
    persistItems(next);

    if (editingId === id) {
      setEditingId(null);
      setEditingTags("");
    }
  }

  function handleClearAll() {
    if (!confirm("Clear all saved responses?")) return;
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
    setEditingId(null);
    setEditingTags("");
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

  function handleStartEdit(item: SavedResponse) {
    setEditingId(item.id);
    setEditingTags((item.tags || []).join(", "));
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditingTags("");
  }

  function handleSaveTags(id: string) {
    const nextTags = parseTags(editingTags);
    const next = items.map((item) =>
      item.id === id ? { ...item, tags: nextTags } : item
    );
    persistItems(next);
    setEditingId(null);
    setEditingTags("");
  }

  return (
    <main className="min-h-screen bg-[#171311] px-6 py-10 text-[#F3EDE6]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-sm text-[#CBBFB3]">TEXAS VOGUE</p>
            <h1 className="mt-3 font-display text-4xl text-[#F3EDE6]">
              Response Library
            </h1>
            <p className="mt-4 max-w-2xl text-[#CBBFB3]">
              Save, review, and reuse your strongest client responses.
            </p>
          </div>

          <button
            onClick={handleClearAll}
            className="rounded-2xl border border-[#4A3E36] px-5 py-3 text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
          >
            Clear All
          </button>
        </div>

        <div className="mb-8 grid gap-4 rounded-3xl border border-[#4A3E36] bg-[#221C19] p-6 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#9D8F83]">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search responses..."
              className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6] outline-none placeholder:text-[#9D8F83]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#9D8F83]">
              Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) =>
                setSourceFilter(
                  e.target.value as "all" | "dashboard" | "coaching" | "scripts"
                )
              }
              className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6]"
            >
              <option value="all">All Sources</option>
              <option value="dashboard">Dashboard</option>
              <option value="coaching">Coaching</option>
              <option value="scripts">Scripts</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#9D8F83]">
              Stage / Category
            </label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6]"
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
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#9D8F83]">
              Tag
            </label>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6]"
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
              className="w-full rounded-2xl border border-[#4A3E36] px-5 py-3 text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="mb-6 text-sm text-[#9D8F83]">
          Showing {filteredItems.length} of {items.length} saved response
          {items.length === 1 ? "" : "s"}.
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-8 text-[#CBBFB3]">
            No saved responses match your filters.
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredItems
              .slice()
              .reverse()
              .map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-6"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-[#9D8F83]">
                          {item.source === "dashboard"
                            ? "Dashboard"
                            : item.source === "coaching"
                            ? "Coaching"
                            : "Scripts"}
                        </p>
                        <h2 className="mt-2 font-display text-2xl text-[#F3EDE6]">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-sm text-[#9D8F83]">
                          Saved {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleCopy(item.response)}
                          className="rounded-2xl border border-[#4A3E36] px-4 py-2 text-sm text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
                        >
                          Copy
                        </button>

                        {!isEditing ? (
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="rounded-2xl border border-[#4A3E36] px-4 py-2 text-sm text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
                          >
                            Edit Tags
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSaveTags(item.id)}
                              className="rounded-2xl border border-[#4A3E36] px-4 py-2 text-sm text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
                            >
                              Save Tags
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="rounded-2xl border border-[#4A3E36] px-4 py-2 text-sm text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-2xl border border-[#4A3E36] px-4 py-2 text-sm text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {!isEditing ? (
                      (item.tags || []).length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags!.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-[#4A3E36] px-3 py-1 text-xs text-[#CBBFB3]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 text-sm text-[#9D8F83]">
                          No tags added yet.
                        </div>
                      )
                    ) : (
                      <div className="mt-4">
                        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#9D8F83]">
                          Edit Tags
                        </label>
                        <input
                          type="text"
                          value={editingTags}
                          onChange={(e) => setEditingTags(e.target.value)}
                          placeholder="spouse, price, overwhelmed"
                          className="w-full rounded-2xl border border-[#4A3E36] bg-[#171311] px-4 py-3 text-[#F3EDE6] outline-none placeholder:text-[#9D8F83]"
                        />
                        <p className="mt-2 text-sm text-[#9D8F83]">
                          Separate tags with commas.
                        </p>
                      </div>
                    )}

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <InfoCard label="Stage / Category" value={item.stage || "—"} />
                      <InfoCard label="Tone" value={item.toneDirection || "—"} />
                      <InfoCard label="Risk" value={item.riskLevel || "—"} />
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                      <ContentCard
                        label="Client Message"
                        value={item.clientMessage}
                      />
                      <ContentCard
                        label="Saved Response"
                        value={item.response}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#4A3E36] bg-[#171311] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#9D8F83]">
        {label}
      </p>
      <p className="mt-2 text-[#F3EDE6]">{value}</p>
    </div>
  );
}

function ContentCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#4A3E36] bg-[#171311] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#9D8F83]">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line text-[#F3EDE6]">{value}</p>
    </div>
  );
}