import Link from "next/link";
import { createClient as createSupabaseClient } from "../utils/supabase/server";
import { logout } from "../app/actions/logout";

export default async function Header() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-[#3B2E26] bg-[#171311] text-[#F3EDE6]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/lead-analyzer"
            className="text-[18px] tracking-[0.08em] text-[#F3EDE6]"
          >
            TEXAS VOGUE
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/lead-analyzer"
              className="rounded-full border border-[#3B2E26] px-5 py-3 text-[15px] text-[#F3EDE6] transition hover:bg-[#241B17]"
            >
              Home
            </Link>

            <Link
              href="/lead-analyzer"
              className="rounded-full border border-[#3B2E26] px-5 py-3 text-[15px] text-[#F3EDE6] transition hover:bg-[#241B17]"
            >
              Lead Analyzer
            </Link>

            <Link
              href="/testing"
              className="rounded-full border border-[#3B2E26] px-5 py-3 text-[15px] text-[#F3EDE6] transition hover:bg-[#241B17]"
            >
              Coaching
            </Link>

            <Link
              href="/scripts"
              className="rounded-full border border-[#3B2E26] px-5 py-3 text-[15px] text-[#F3EDE6] transition hover:bg-[#241B17]"
            >
              Scripts
            </Link>

            <Link
              href="/library"
              className="rounded-full border border-[#3B2E26] px-5 py-3 text-[15px] text-[#F3EDE6] transition hover:bg-[#241B17]"
            >
              Response Library
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-[#CDBFB2]">{user.email}</span>

              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full border border-[#3B2E26] px-5 py-3 text-[15px] text-[#F3EDE6] transition hover:bg-[#241B17]"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-[#3B2E26] px-5 py-3 text-[15px] text-[#F3EDE6] transition hover:bg-[#241B17]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}