import Link from "next/link";
import { signInWithPassword, signUpWithPassword, sendMagicLink } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<{
    message?: string;
    redirectedFrom?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const message = params.message ?? "";
  const redirectedFrom = params.redirectedFrom ?? "/dashboard";

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#120c0b_0%,#1b1412_42%,#0c0908_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="flex flex-col justify-center">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-stone-300/80">
              Texas Vogue
            </p>

            <h1 className="max-w-xl text-4xl font-light leading-tight md:text-5xl">
              Welcome back to your client conversation studio.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-300">
              Sign in to access your lead analyzer, coaching tools, scripts, and response
              library. Built to help you guide client conversations with more clarity,
              confidence, and ease.
            </p>

            <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm text-stone-300">Lead Analyzer</p>
                <p className="mt-2 text-sm text-stone-400">Read emotional need and buyer stage faster.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm text-stone-300">Coaching</p>
                <p className="mt-2 text-sm text-stone-400">Practice real conversation scenarios with guidance.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm text-stone-300">Scripts</p>
                <p className="mt-2 text-sm text-stone-400">Use polished replies that feel natural and helpful.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl backdrop-blur md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-light">Sign in</h2>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                Enter your email and password below, or request a magic link.
              </p>
            </div>

            {message ? (
              <div className="mb-6 rounded-2xl border border-amber-200/20 bg-amber-100/10 px-4 py-3 text-sm text-amber-100">
                {message}
              </div>
            ) : null}

            <form action={signInWithPassword} className="space-y-4">
              <input type="hidden" name="redirectedFrom" value={redirectedFrom} />

              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-stone-200">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-stone-500 outline-none transition focus:border-stone-300/50"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm text-stone-200">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-stone-500 outline-none transition focus:border-stone-300/50"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15"
              >
                Sign in
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.25em] text-stone-400">Or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form action={sendMagicLink} className="space-y-4">
              <input type="hidden" name="redirectedFrom" value={redirectedFrom} />
              <div>
                <label htmlFor="magic-email" className="mb-2 block text-sm text-stone-200">
                  Email for magic link
                </label>
                <input
                  id="magic-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-stone-500 outline-none transition focus:border-stone-300/50"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/8"
              >
                Email me a magic link
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-sm text-stone-300">New here?</p>
              <p className="mt-1 text-sm leading-6 text-stone-400">
                Create your account with the same email you want to use for access.
              </p>

              <form action={signUpWithPassword} className="mt-4 space-y-4">
                <input type="hidden" name="redirectedFrom" value={redirectedFrom} />

                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-stone-500 outline-none transition focus:border-stone-300/50"
                />

                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Create a password"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-stone-500 outline-none transition focus:border-stone-300/50"
                />

                <button
                  type="submit"
                  className="w-full rounded-2xl border border-[#b69b7a]/30 bg-[#b69b7a]/15 px-4 py-3 text-sm font-medium text-[#f3e7d9] transition hover:bg-[#b69b7a]/20"
                >
                  Create account
                </button>
              </form>
            </div>

            <div className="mt-6 text-sm text-stone-400">
              <Link href="/" className="underline underline-offset-4 hover:text-stone-200">
                Back to home
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}