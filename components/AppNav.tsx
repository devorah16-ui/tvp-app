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
    <header className="sticky top-0 z-50 border-b border-[#4A3E36] bg-[#171311]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-2xl border border-[#4A3E36] px-4 py-2 text-sm text-[#CBBFB3] transition hover:border-[#C6A978] hover:text-white"
          >
            Back
          </button>

          <Link href="/" className="font-display text-sm text-[#F3EDE6]">
            TEXAS VOGUE
          </Link>
        </div>

        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-[#C6A978] text-black"
                    : "border border-[#4A3E36] text-[#CBBFB3] hover:border-[#C6A978] hover:text-white"
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