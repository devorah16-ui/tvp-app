import Link from "next/link";
import { createClient as createSupabaseClient } from "../utils/supabase/server";
import { logout } from "../app/actions/auth";

export default async function Header() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-sm text-white/80">
          TEXAS VOGUE
        </Link>

        <nav className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/lead-analyzer">Lead Analyzer</Link>
          <Link href="/testing">Coaching</Link>
          <Link href="/scripts">Scripts</Link>
          <Link href="/library">Response Library</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <span className="text-white/60">{user.email}</span>

            <form action={logout}>
              <button className="border border-white/20 px-3 py-1 rounded">
                Logout
              </button>
            </form>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </header>
  );
}