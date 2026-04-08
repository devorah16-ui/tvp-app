"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Lead Analyzer" },
  { href: "/testing", label: "Coaching" },
  { href: "/scripts", label: "Scripts" },
  { href: "/library", label: "Response Library" },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        
        {/* Left side: Back + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-2xl border border-stone-700 px-4 py-2 text-sm text-stone-200 transition hover:border-stone-500 hover:text-white"
          >
            Back
          </button>

          <Link
            href="/"
            className="text-sm uppercase tracking-[0.35em] text-stone-300 hover:text-white transition"
          >
            Texas Vogue
          </Link>
        </div>

        {/* Right side: Navigation */}
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-white text-black"
                    : "border border-stone-700 text-stone-200 hover:border-stone-500 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}