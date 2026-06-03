import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInvoiceReference } from "@/lib/membership/invoice";
import { getBankDetails } from "@/lib/bankDetails";
import { sendEmail } from "@/lib/email/sendEmail";
import { membershipInvoiceEmail } from "@/lib/email/templates/membershipInvoiceEmail";
import { adminBankTransferRequestEmail } from "@/lib/email/templates/adminBankTransferRequestEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { tierId } = await request.json();

    if (!tierId) {
      return Response.json(
        { message: "Membership tier is required." },
        { status: 400 }
      );
    }

    const tier = await prisma.membershipTier.findUnique({
      where: { id: tierId },
    });

    if (!tier) {
      return Response.json(
        { message: "Membership tier not found." },
        { status: 404 }
      );
    }

    // Reuse an existing pending bank-transfer request if there is one
    let membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        status: "PENDING",
        paymentMethod: "BANK_TRANSFER",
      },
    });

    if (membership) {
      // Update it to the newly chosen tier/amount
      membership = await prisma.membership.update({
        where: { id: membership.id },
        data: { tierId, amount: tier.price },
      });
    } else {
      membership = await prisma.membership.create({
        data: {
          userId: session.user.id,
          tierId,
          status: "PENDING",
          paymentMethod: "BANK_TRANSFER",
          invoiceReference: generateInvoiceReference(),
          amount: tier.price,
        },
      });
    }

    const bank = getBankDetails();

    // Email the invoice to the member
    sendEmail({
      to: session.user.email,
      subject: `Your ABGCC membership invoice — ${membership.invoiceReference}`,
      html: membershipInvoiceEmail({
        name: session.user.name,
        tierName: tier.title,
        amount: tier.price,
        reference: membership.invoiceReference,
        bank,
      }),
    }).catch((err) => console.error("MEMBERSHIP_INVOICE_EMAIL_ERROR:", err));

    // Notify ABGCC admin
    const adminEmail =
      process.env.CONTACT_EMAIL ||
      process.env.ADMIN_EMAIL ||
      process.env.EMAIL_FROM;

    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `New bank-transfer request: ${tier.title}`,
        html: adminBankTransferRequestEmail({
          userName: session.user.name,
          userEmail: session.user.email,
          tierName: tier.title,
          amount: tier.price,
          reference: membership.invoiceReference,
        }),
        replyTo: session.user.email,
      }).catch((err) => console.error("ADMIN_BANK_TRANSFER_EMAIL_ERROR:", err));
    }

    return Response.json({
      message: "Invoice created.",
      reference: membership.invoiceReference,
    });
  } catch (error) {
    console.error("BANK_TRANSFER_REQUEST_ERROR:", error);
    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
