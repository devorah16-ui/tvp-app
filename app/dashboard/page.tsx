import Link from "next/link";
import { requirePaidAccess } from "../../utils/access";

export default async function DashboardPage() {
  const { user, profile } = await requirePaidAccess();

  return (
    <main className="min-h-screen bg-[#171311] px-6 py-12 text-[#F3EDE6]">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[32px] border border-[#4A3E36] bg-[#221C19] p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9D8F83]">
            Dashboard
          </p>

          <h1 className="mt-4 font-display text-4xl text-[#F3EDE6]">
            Welcome inside
          </h1>

          <p className="mt-4 text-[#CBBFB3]">
            Signed in as {user.email} · status: {profile.subscription_status}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link
              href="/lead-analyzer"
              className="rounded-3xl border border-[#4A3E36] bg-[#171311] p-6 transition hover:border-[#C6A978]"
            >
              <h2 className="text-xl text-[#F3EDE6]">Lead Analyzer</h2>
              <p className="mt-2 text-[#CBBFB3]">
                Analyze real client messages and generate guided responses.
              </p>
            </Link>

            <div className="rounded-3xl border border-[#4A3E36] bg-[#171311] p-6">
              <h2 className="text-xl text-[#F3EDE6]">More sections</h2>
              <p className="mt-2 text-[#CBBFB3]">
                Add your other protected app sections here using the same paid
                access rule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}