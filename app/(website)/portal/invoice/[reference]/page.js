export const dynamic = "force-dynamic";

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBankDetails } from "@/lib/bankDetails";
import { Reveal } from "@/components/MotionReveal";

import "@/styles/invoice.css";

export default async function InvoicePage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { reference } = await params;

  const membership = await prisma.membership.findUnique({
    where: { invoiceReference: reference },
    include: { tier: true, user: true },
  });

  if (!membership) notFound();

  // Only the owner (or an admin) may view the invoice
  const isOwner = membership.user?.email === session.user.email;
  const isAdmin = session.user?.role === "SUPER_ADMIN";
  if (!isOwner && !isAdmin) redirect("/portal");

  const bank = getBankDetails();
  const amount = membership.amount ?? membership.tier.price;
  const isActive = membership.status === "ACTIVE";

  return (
    <main className="invoice-page">
      <div className="invoice-container">
        <Reveal>
          <Link href="/portal" className="invoice-back">
            <ArrowLeft size={16} />
            Back to Portal
          </Link>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="invoice-card">
            <div className="invoice-card-head">
              <div>
                <p className="invoice-eyebrow">Membership Invoice</p>
                <h1>{membership.tier.title}</h1>
              </div>

              <span className={`invoice-status ${isActive ? "paid" : "pending"}`}>
                {isActive ? "Paid" : "Awaiting Payment"}
              </span>
            </div>

            {isActive ? (
              <div className="invoice-paid-banner">
                <CheckCircle2 size={20} />
                <span>
                  Payment received — your membership is active. Thank you!
                </span>
              </div>
            ) : (
              <p className="invoice-intro">
                To complete your membership, please transfer the amount below to
                the ABGCC account, including your reference. Your membership
                activates once we confirm the payment.
              </p>
            )}

            <div className="invoice-amount-row">
              <div>
                <span className="invoice-label">Amount Due</span>
                <span className="invoice-amount">${amount}</span>
              </div>

              <div>
                <span className="invoice-label">Reference</span>
                <span className="invoice-reference">
                  {membership.invoiceReference}
                </span>
              </div>
            </div>

            {!isActive && (
              <div className="invoice-bank">
                <p className="invoice-label">Bank Transfer Details</p>

                <div className="invoice-bank-grid">
                  <div><span>Bank</span><strong>{bank.bankName}</strong></div>
                  <div><span>Account Name</span><strong>{bank.accountName}</strong></div>
                  <div><span>IBAN</span><strong>{bank.iban}</strong></div>
                  <div><span>SWIFT / BIC</span><strong>{bank.swift}</strong></div>
                  <div><span>Bank Address</span><strong>{bank.address}</strong></div>
                </div>

                <p className="invoice-note">{bank.note}</p>
              </div>
            )}

            <p className="invoice-footnote">
              A copy of this invoice has also been sent to your email.
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
