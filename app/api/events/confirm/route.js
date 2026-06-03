import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { fulfillEventCheckout } from "@/lib/events/fulfillEventCheckout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called by the success page when the user returns from Stripe.
// Creates the booking + sends emails immediately (doesn't wait for the webhook).
export async function POST(request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return Response.json({ message: "Missing session." }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    const booking = await fulfillEventCheckout(checkoutSession);

    if (!booking) {
      return Response.json(
        { message: "Payment not confirmed yet." },
        { status: 400 }
      );
    }

    revalidatePath("/events");
    revalidatePath("/admin/events");

    return Response.json({
      ok: true,
      reference: booking.reference,
    });
  } catch (error) {
    console.error("EVENT_CONFIRM_ERROR:", error);
    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
