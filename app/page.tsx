import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#171311] px-6 py-12 text-[#F3EDE6]">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-display">Client Conversation AI</h1>

        <p className="mt-4 text-[#CBBFB3]">
          Confident client conversations that convert into meaningful bookings.
        </p>

        <div className="mt-6 flex gap-4">
          <Link href="/pricing" className="bg-[#C6A978] px-6 py-3 rounded-2xl text-black">
            Start Free Trial
          </Link>

          <Link href="/login" className="border px-6 py-3 rounded-2xl">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}