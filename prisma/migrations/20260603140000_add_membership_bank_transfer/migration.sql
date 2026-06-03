-- AlterTable
ALTER TABLE "Membership" ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'CARD',
ADD COLUMN "invoiceReference" TEXT,
ADD COLUMN "amount" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Membership_invoiceReference_key" ON "Membership"("invoiceReference");
