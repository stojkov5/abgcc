-- AlterTable: track which renewal reminders have been sent for the current term
ALTER TABLE "Membership" ADD COLUMN "reminder30SentAt" TIMESTAMP(3);
ALTER TABLE "Membership" ADD COLUMN "reminder7SentAt" TIMESTAMP(3);
