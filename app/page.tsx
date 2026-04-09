import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#171311] px-6 py-10 text-[#F3EDE6]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="font-display text-5xl text-[#F3EDE6]">
            Client Conversation System
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#CBBFB3]">
            A refined system for understanding clients, guiding conversations,
            and building meaningful connections that lead to confident
            decisions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/dashboard"
            className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-6 transition hover:border-[#C6A978] hover:bg-[#2B2420]"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#9D8F83]">
              01
            </p>
            <h2 className="mt-3 font-display text-2xl text-[#F3EDE6]">
              Lead Analyzer
            </h2>
            <p className="mt-3 text-[#CBBFB3]">
              Understand client intent, identify emotional drivers, and shape a
              clear next response.
            </p>
          </Link>

          <Link
            href="/testing"
            className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-6 transition hover:border-[#C6A978] hover:bg-[#2B2420]"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#9D8F83]">
              02
            </p>
            <h2 className="mt-3 font-display text-2xl text-[#F3EDE6]">
              Coaching
            </h2>
            <p className="mt-3 text-[#CBBFB3]">
              Practice real client conversations, refine your wording, and build
              confidence before replying live.
            </p>
          </Link>

          <Link
            href="/scripts"
            className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-6 transition hover:border-[#C6A978] hover:bg-[#2B2420]"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#9D8F83]">
              03
            </p>
            <h2 className="mt-3 font-display text-2xl text-[#F3EDE6]">
              Scripts
            </h2>
            <p className="mt-3 text-[#CBBFB3]">
              Keep foundational language for inquiries, objections, and guided
              next steps in one place.
            </p>
          </Link>

          <Link
            href="/library"
            className="rounded-3xl border border-[#4A3E36] bg-[#221C19] p-6 transition hover:border-[#C6A978] hover:bg-[#2B2420]"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#9D8F83]">
              04
            </p>
            <h2 className="mt-3 font-display text-2xl text-[#F3EDE6]">
              Response Library
            </h2>
            <p className="mt-3 text-[#CBBFB3]">
              Save, organize, and reuse your strongest client responses with
              clarity.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}