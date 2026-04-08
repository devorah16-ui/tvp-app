import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-stone-400">
            Texas Vogue
          </p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight">
            Client Conversation AI
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-300">
            Luxury client response support, coaching, and reusable response
            strategy for the Texas Vogue experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/dashboard"
            className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-stone-400">
              01
            </p>
            <h2 className="mt-3 text-2xl font-medium">Lead Analyzer</h2>
            <p className="mt-3 text-stone-300">
              Review a client message, identify emotional need, and generate a
              guided response.
            </p>
          </Link>

          <Link
            href="/testing"
            className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-stone-400">
              02
            </p>
            <h2 className="mt-3 text-2xl font-medium">Coaching</h2>
            <p className="mt-3 text-stone-300">
              Practice real client situations, refine your responses, and get
              guided feedback before replying live.
            </p>
          </Link>

          <Link
            href="/library"
            className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-stone-400">
              03
            </p>
            <h2 className="mt-3 text-2xl font-medium">Response Library</h2>
            <p className="mt-3 text-stone-300">
              Save your strongest responses and reuse them when similar leads
              come in.
            </p>
          </Link>

          <Link
            href="/scripts"
            className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-stone-400">
              04
            </p>
            <h2 className="mt-3 text-2xl font-medium">Script Library</h2>
            <p className="mt-3 text-stone-300">
              Keep your foundational guidance, script structure, and support
              language in one place.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}