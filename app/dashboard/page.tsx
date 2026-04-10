import Link from "next/link";
import { requirePaidAccess } from "../../utils/access";

export default async function DashboardPage() {
  await requirePaidAccess();

  return (
    <main className="min-h-screen bg-[#171311] px-6 py-12 text-[#F3EDE6]">
      <h1 className="text-3xl">Dashboard</h1>

      <div className="mt-6">
        <Link href="/lead-analyzer" className="underline">
          Go to Lead Analyzer
        </Link>
      </div>
    </main>
  );
}