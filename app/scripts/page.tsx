export default function ScriptsPage() {
    return (
      <main className="min-h-screen bg-stone-950 text-white px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.35em] text-stone-400">
              Texas Vogue
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Script Library
            </h1>
            <p className="mt-4 max-w-2xl text-stone-300">
              Keep your guided language organized for discovery, reassurance,
              objections, and booking conversations.
            </p>
          </div>
  
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <h2 className="text-2xl font-medium">Atelier Script</h2>
              <p className="mt-3 text-stone-300">
                Luxury, guided language for women, mothers, and editorial-style
                portrait experiences.
              </p>
            </div>
  
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <h2 className="text-2xl font-medium">Heirloom Script</h2>
              <p className="mt-3 text-stone-300">
                Warm, refined language focused on children, families, milestones,
                and meaningful artwork.
              </p>
            </div>
  
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <h2 className="text-2xl font-medium">Objection Handling</h2>
              <p className="mt-3 text-stone-300">
                Thoughtful responses for hesitation around price, timing, spouse,
                and overwhelm.
              </p>
            </div>
  
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <h2 className="text-2xl font-medium">Discovery Calls</h2>
              <p className="mt-3 text-stone-300">
                Conversation structure that helps clients feel understood,
                supported, and guided.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }