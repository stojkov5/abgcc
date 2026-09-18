-- CreateEnum
CREATE TYPE "TeamSection" AS ENUM ('TEAM', 'ADVISORY');

-- CreateTable: About-page people cards (Meet the Team / Advisory Board)
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "bio" TEXT,
    "linkedin" TEXT,
    "section" "TeamSection" NOT NULL DEFAULT 'TEAM',
    "imagePosition" TEXT NOT NULL DEFAULT 'center top',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);
