import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { checkinUrl } from "@/lib/events/reference";

export const runtime = "nodejs";

// Public endpoint — returns the QR PNG for a ticket reference.
// Used as an <img src> inside ticket emails, so it must be unauthenticated.
export async function GET(request, { params }) {
  try {
    const { reference } = await params;

    // Only generate a QR for a reference that actually exists
    const booking = await prisma.eventBooking.findUnique({
      where: { reference },
      select: { id: true, reference: true },
    });

    if (!booking) {
      return new Response("Not found", { status: 404 });
    }

    const pngBuffer = await QRCode.toBuffer(checkinUrl(booking.reference), {
      type: "png",
      width: 600,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#10243f",
        light: "#ffffff",
      },
    });

    return new Response(pngBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("QR_GENERATION_ERROR:", error);
    return new Response("Error", { status: 500 });
  }
}
