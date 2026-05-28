import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="relative overflow-hidden bg-[#f4f8fc]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.10),transparent_30%)]" />

      <section className="relative flex min-h-screen items-center justify-center px-6 py-32">
        <div className="w-full max-w-3xl overflow-hidden rounded-[40px] border border-white/60 bg-white/75 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-14">
          
          {/* Top Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Payment Confirmed
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-4xl font-black leading-[0.95] tracking-[-0.04em] text-[#0f172a] md:text-7xl">
            Welcome to
            <span className="block text-[#c89b3c]">
              ABGCC.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Your payment was successfully completed. Your membership is now
            being processed and will be activated once Stripe confirms the
            transaction.
          </p>

          {/* Info Box */}
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
            <p className="text-sm leading-7 text-slate-500 md:text-base">
              You will receive a confirmation email shortly with your membership
              details and access information.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/portal"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f172a] px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#1e293b]"
            >
              Go To Portal
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-700 transition-all duration-300 hover:border-slate-900 hover:text-slate-900"
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}