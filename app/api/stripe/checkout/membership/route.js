import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { tierId } = body;

    if (!tierId) {
      return Response.json(
        { message: "Membership tier is required." },
        { status: 400 }
      );
    }

    const tier = await prisma.membershipTier.findUnique({
      where: {
        id: tierId,
      },
    });

    if (!tier) {
      return Response.json(
        { message: "Membership tier not found." },
        { status: 404 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      customer_email: session.user.email,

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: tier.title,
              description: tier.description,
            },

            unit_amount: Math.round(tier.price * 100),
          },

          quantity: 1,
        },
      ],

      metadata: {
        userId: session.user.id,
        tierId: tier.id,
      },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    });

    return Response.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("STRIPE_CHECKOUT_ERROR:", error);

    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}