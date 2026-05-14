import Link from "next/link";
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
      <section className="relative w-full overflow-hidden  pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.16),transparent_35%)]" />

        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid min-h-162.5 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-170">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-yellow-400 sm:text-sm">
                American Balkan Global Chamber of Commerce
              </p>

              <h1 className="text-[52px] font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-[64px] lg:text-[76px]">
                Connecting Balkan and American business.
              </h1>

              <p className="mt-8 max-w-155 text-lg leading-8 text-white/65">
                ABGCC strengthens commercial relationships, strategic
                partnerships, and economic collaboration between the United
                States, the Balkans, and global partners.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/membership"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-black transition hover:bg-yellow-400"
                >
                  Become a Member <ArrowRight size={17} />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="w-full rounded-4xl border border-white/10 bg-white/4 p-8 shadow-2xl backdrop-blur">
              <h2 className="mb-7 text-3xl font-bold text-white">
                Core Pillars
              </h2>

              <div className="grid gap-4">
                {pillars.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/50 px-6 py-5 text-lg font-semibold text-white transition hover:border-yellow-400/50 hover:bg-white/6"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}