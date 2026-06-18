-- AlterTable
ALTER TABLE "User" ADD COLUMN "memberNumber" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_memberNumber_key" ON "User"("memberNumber");

-- Backfill: assign sequential member numbers (starting at 10014) to all users
-- who currently have an active membership, ordered by when they joined.
WITH ranked AS (
  SELECT u.id, ROW_NUMBER() OVER (ORDER BY u."createdAt" ASC) AS rn
  FROM "User" u
  WHERE EXISTS (
    SELECT 1 FROM "Membership" m
    WHERE m."userId" = u.id
      AND m.status = 'ACTIVE'
      AND m."endDate" > NOW()
  )
)
UPDATE "User" u
SET "memberNumber" = 10013 + r.rn
FROM ranked r
WHERE u.id = r.id;
