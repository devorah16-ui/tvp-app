import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#171311] px-6 py-10 text-[#F3EDE6]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="font-display text-sm text-[#CBBFB3]">TEXAS VOGUE</p>
          <h1 className="mt-3 font-display text-5xl text-[#F3EDE6]">
            Client Conversation AI
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[#CBBFB3]">
            Luxury client response support, coaching, and reusable response
            strategy for the Texas Vogue experience.
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
              Review a client message, identify emotional need, and generate a
              guided response.
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
              Practice real client situations, refine your responses, and get
              guided feedback before replying live.
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
              Keep your foundational guidance, objections, consultation
              language, and next-step phrasing in one place.
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
              Save your strongest responses and reuse them when similar leads
              come in.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}