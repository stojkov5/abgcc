-- AlterTable
ALTER TABLE "EventBooking" ADD COLUMN "reference" TEXT,
ADD COLUMN "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "stripeSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "EventBooking_reference_key" ON "EventBooking"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "EventBooking_stripeSessionId_key" ON "EventBooking"("stripeSessionId");
