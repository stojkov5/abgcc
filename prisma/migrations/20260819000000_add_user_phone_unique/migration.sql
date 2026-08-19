-- Enforce: one phone number belongs to only one account.
-- Blank phones are normalized to NULL first so "no phone" never collides
-- (Postgres treats each NULL as distinct in a unique index).
UPDATE "User" SET "phone" = NULL WHERE "phone" = '';

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
