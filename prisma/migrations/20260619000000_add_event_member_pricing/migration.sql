-- AlterTable: add the two-tier pricing columns to Event
ALTER TABLE "Event" ADD COLUMN "nonMemberPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Event" ADD COLUMN "memberPrice" DOUBLE PRECISION;

-- Backfill: the existing single price becomes the non-member (general) rate.
UPDATE "Event" SET "nonMemberPrice" = "price";

-- Drop the old single-price column now that it has been migrated.
ALTER TABLE "Event" DROP COLUMN "price";

-- AlterTable: record the member number that claimed the member rate (if any).
ALTER TABLE "EventBooking" ADD COLUMN "memberNumber" INTEGER;
