import { StructurePlayground } from "./components/structure-playground";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-24 px-6 pb-24 pt-20 lg:px-12">
        <div className="absolute inset-x-10 -top-20 h-52 rounded-full bg-cyan-500/30 blur-3xl" />
        <header className="relative flex flex-col gap-10 text-left">
          <div className="inline-flex max-w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200">
            DS Lab
            <span className="h-1 w-1 rounded-full bg-cyan-300" />
            Interactive data structures
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Understand core data structures through animated, tactile walkthroughs.
            </h1>
            <p className="max-w-2xl text-lg text-slate-200">
              Run hands-on simulations for arrays, stacks, queues, and binary search
              trees. Adjust inputs, inspect timelines, and internalize the costs of each
              operation.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-200">
              <div className="font-semibold text-white">
                4 structures
                <span className="ml-2 font-normal text-slate-400">
                  curated for interview prep
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                Step-by-step visual traces
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                Space & time complexity callouts
              </div>
            </div>
          </div>
        </header>

        <section className="relative rounded-[2.5rem] border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-md md:px-10">
          <div className="absolute -top-10 right-6 h-44 w-44 rounded-full bg-cyan-500/40 blur-3xl" />
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Why it matters</h2>
              <p className="text-sm text-slate-200">
                Data structures are the vocabulary of problem solving. Learning the
                mechanics behind each operation builds the intuition you need to architect
                systems, master coding interviews, and debug complex code in production.
              </p>
            </div>
            <ul className="col-span-2 grid gap-4 text-sm text-slate-200 md:grid-cols-2">
              <li className="rounded-2xl border border-white/5 bg-white/10 p-4">
                <h3 className="font-semibold text-white">Mental models first</h3>
                <p className="mt-2">
                  Visual decompositions help you reason about pointer updates, shifts, and
                  invariants with confidence.
                </p>
              </li>
              <li className="rounded-2xl border border-white/5 bg-white/10 p-4">
                <h3 className="font-semibold text-white">Move at your pace</h3>
                <p className="mt-2">
                  Tweak inputs, rerun scenarios, and explore edge cases without writing a
                  single line of code.
                </p>
              </li>
              <li className="rounded-2xl border border-white/5 bg-white/10 p-4">
                <h3 className="font-semibold text-white">Complexity insights</h3>
                <p className="mt-2">
                  Each run surfaces big-O costs and practical takeaways, grounding the
                  theory in real decisions.
                </p>
              </li>
              <li className="rounded-2xl border border-white/5 bg-white/10 p-4">
                <h3 className="font-semibold text-white">Interview ready</h3>
                <p className="mt-2">
                  Build the muscle memory to vocalize trade-offs and narrate algorithmic
                  steps during technical interviews.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <div className="relative">
          <div className="absolute inset-x-12 -top-12 h-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <StructurePlayground />
        </div>

        <section className="relative grid gap-10 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 text-slate-100 shadow-2xl shadow-cyan-500/10 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Cheat sheet</h2>
            <p className="text-sm text-slate-200">
              Ready-to-reference mappings for the most common structure operations and
              their complexities.
            </p>
            <dl className="grid gap-4 text-sm">
              {[
                { label: "Array insert / delete (middle)", time: "O(n)", space: "O(1)" },
                { label: "Stack push / pop", time: "O(1)", space: "O(1)" },
                { label: "Queue enqueue", time: "O(1)", space: "O(1)" },
                { label: "Queue dequeue (array)", time: "O(n)", space: "O(1)" },
                { label: "BST insert (average)", time: "O(log n)", space: "O(1)" },
              ].map((entry) => (
                <div
                  key={entry.label}
                  className="rounded-2xl border border-white/5 bg-white/10 p-4"
                >
                  <dt className="font-semibold text-white">{entry.label}</dt>
                  <dd className="mt-2 flex items-center gap-4">
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                      Time {entry.time}
                    </span>
                    <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-100">
                      Space {entry.space}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Further study</h2>
            <ul className="grid gap-4 text-sm text-slate-200">
              {[
                {
                  title: "Okasaki, Purely Functional Data Structures",
                  description:
                    "Explore persistent structures and amortized analysis with immutable techniques.",
                  href: "https://www.cambridge.org/core/books/purely-functional-data-structures/1AE18D1286A29940E7C86B53C8C70F69",
                },
                {
                  title: "Skiena, The Algorithm Design Manual",
                  description:
                    "A pragmatic guide for selecting structures and algorithms in real-world scenarios.",
                  href: "https://www.algorist.com/",
                },
                {
                  title: "CS50 2023 — Data Structures",
                  description:
                    "Video lectures that blend conceptual overviews with implementation walkthroughs.",
                  href: "https://cs50.harvard.edu/x/2023/notes/5/",
                },
              ].map((resource) => (
                <li
                  key={resource.title}
                  className="rounded-2xl border border-white/5 bg-white/10 p-4 transition hover:border-cyan-400/60 hover:bg-white/20"
                >
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="space-y-2"
                  >
                    <h3 className="font-semibold text-white">{resource.title}</h3>
                    <p>{resource.description}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="border-t border-white/10 pt-8 text-sm text-slate-400">
          Built with Next.js • Tailwind CSS • Ready to deploy on Vercel.
        </footer>
      </main>
    </div>
  );
}
