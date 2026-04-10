import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#171311] px-6 py-12 text-[#F3EDE6]">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] border border-[#4A3E36] bg-[#221C19] p-8 shadow-2xl md:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9D8F83]">
            Client Conversation AI
          </p>

          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-[#F3EDE6] md:text-6xl">
            Confident client conversations for photographers who want to book
            with more clarity.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#CBBFB3]">
            Analyze client messages, understand emotional drivers, and generate
            thoughtful responses that move conversations forward without sounding
            generic, pushy, or uncertain.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/pricing"
              className="rounded-2xl bg-[#C6A978] px-6 py-3 font-medium text-black transition hover:bg-[#D7BB8C]"
            >
              Start Your 7-Day Trial
            </Link>

            <Link
              href="/login"
              className="rounded-2xl border border-[#4A3E36] px-6 py-3 text-[#F3EDE6] transition hover:border-[#C6A978]"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Client Message Analysis"
              text="Understand hesitation, emotional need, and decision stage quickly."
            />
            <FeatureCard
              title="Guided Responses"
              text="Generate calm, natural responses that help move conversations forward."
            />
            <FeatureCard
              title="Built for Photographers"
              text="Created specifically for portrait and boutique studio workflows."
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-[#4A3E36] bg-[#171311] p-5">
      <h2 className="text-sm uppercase tracking-[0.22em] text-[#9D8F83]">
        {title}
      </h2>
      <p className="mt-3 text-[#CBBFB3]">{text}</p>
    </div>
  );
}