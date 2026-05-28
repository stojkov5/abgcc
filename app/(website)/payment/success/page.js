import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen px-6 pb-20 pt-32">
      <section className="mx-auto max-w-4xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
          Payment
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Payment successful.
        </h1>

        <p className="mb-10 text-lg leading-8 text-white/70">
          Your payment was completed. Your membership will be activated after
          Stripe confirms the transaction.
        </p>

        <Link
          href="/portal"
          className="inline-flex rounded-full bg-white px-6 py-3 font-semibold text-black"
        >
          Go to Portal
        </Link>
      </section>
    </main>
  );
}