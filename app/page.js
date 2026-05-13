import { ArrowRight } from "lucide-react";

const pillars = [
  "Investment & Connections",
  "Market Entry",
  "Growth Network",
  "Strategic Business Bridge",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="px-6 pb-20 pt-32 md:pt-40">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-white/50 sm:text-sm">
              American Balkan Global Chamber of Commerce
            </p>

            <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl xl:text-7xl">
              Connecting Balkan and American business.
            </h1>

            <p className="mb-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              ABGCC strengthens commercial relationships, strategic partnerships,
              and economic collaboration between the United States, the Balkans,
              and global partners.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="/membership"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Become a Member <ArrowRight size={18} />
              </a>

              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl sm:p-8">
            <h2 className="mb-6 text-2xl font-semibold">Core Pillars</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {pillars.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/40 p-5"
                >
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}