import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

import { sendEmail } from "@/lib/email/sendEmail";
import { paymentSuccessEmail } from "@/lib/email/templates/paymentSuccessEmail";
import { adminMembershipActivatedEmail } from "@/lib/email/templates/adminMembershipActivatedEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("STRIPE_WEBHOOK_SIGNATURE_ERROR:", error.message);

    return Response.json(
      { message: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object;

      const userId = checkoutSession.metadata?.userId;
      const tierId = checkoutSession.metadata?.tierId;

      if (!userId || !tierId) {
        return Response.json(
          { message: "Missing metadata." },
          { status: 400 },
        );
      }

      const existingPayment = await prisma.payment.findUnique({
        where: {
          stripeSessionId: checkoutSession.id,
        },
      });

      if (existingPayment) {
        return Response.json({ received: true });
      }

      const tier = await prisma.membershipTier.findUnique({
        where: {
          id: tierId,
        },
      });

      if (!tier) {
        return Response.json(
          { message: "Membership tier not found." },
          { status: 404 },
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
        },
      });

      const now = new Date();
      const endDate = new Date(now);
      endDate.setFullYear(endDate.getFullYear() + 1);

      await prisma.payment.create({
        data: {
          stripeSessionId: checkoutSession.id,
          amount: Number(checkoutSession.amount_total || 0) / 100,
          currency: checkoutSession.currency || "usd",
          status: checkoutSession.payment_status || "paid",
          userId,
          tierId,
        },
      });

      let membershipEndDate;

      const activeMembership = await prisma.membership.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
        orderBy: {
          endDate: "desc",
        },
      });

      if (activeMembership) {
        const renewalBaseDate =
          activeMembership.endDate && activeMembership.endDate > now
            ? new Date(activeMembership.endDate)
            : now;

        const extendedEndDate = new Date(renewalBaseDate);
        extendedEndDate.setFullYear(extendedEndDate.getFullYear() + 1);

        const updatedMembership = await prisma.membership.update({
          where: {
            id: activeMembership.id,
          },
          data: {
            tierId,
            endDate: extendedEndDate,
            status: "ACTIVE",
          },
        });

        membershipEndDate = updatedMembership.endDate;
      } else {
        const newMembership = await prisma.membership.create({
          data: {
            userId,
            tierId,
            status: "ACTIVE",
            startDate: now,
            endDate,
          },
        });

        membershipEndDate = newMembership.endDate;
      }

      const formattedAmount = `$${Number(
        checkoutSession.amount_total || 0,
      ) / 100}`;

      const formattedRenewalDate = membershipEndDate
        ? new Date(membershipEndDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Updated in your portal";

      if (user?.email) {
        sendEmail({
          to: user.email,
          subject: "Your ABGCC membership is active",
          html: paymentSuccessEmail({
            name: user.name,
            tierName: tier.title,
            amount: formattedAmount,
            renewalDate: formattedRenewalDate,
          }),
        }).catch((error) => {
          console.error("PAYMENT_SUCCESS_EMAIL_ERROR:", error);
        });
      }

      if (process.env.ADMIN_EMAIL) {
        sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: "New ABGCC membership activated",
          html: adminMembershipActivatedEmail({
            userName: user?.name,
            userEmail: user?.email,
            tierName: tier.title,
            amount: formattedAmount,
            renewalDate: formattedRenewalDate,
          }),
        }).catch((error) => {
          console.error("ADMIN_MEMBERSHIP_EMAIL_ERROR:", error);
        });
      }

      revalidatePath("/portal");
      revalidatePath("/admin/users");
      revalidatePath(`/admin/users/${userId}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("STRIPE_WEBHOOK_HANDLER_ERROR:", error);

    return Response.json(
      { message: error?.message || "Webhook failed." },
      { status: 500 },
    );
  }
}