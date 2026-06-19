-- AlterTable: add member directory / company profile fields (all additive, nullable)
ALTER TABLE "User" ADD COLUMN "logo" TEXT;
ALTER TABLE "User" ADD COLUMN "companyDescription" TEXT;
ALTER TABLE "User" ADD COLUMN "website" TEXT;
ALTER TABLE "User" ADD COLUMN "industrySector" TEXT;
ALTER TABLE "User" ADD COLUMN "industryTags" TEXT;
ALTER TABLE "User" ADD COLUMN "keyContactName" TEXT;
ALTER TABLE "User" ADD COLUMN "keyContactTitle" TEXT;
ALTER TABLE "User" ADD COLUMN "keyContactEmail" TEXT;
ALTER TABLE "User" ADD COLUMN "address" TEXT;
ALTER TABLE "User" ADD COLUMN "bannerImage" TEXT;
ALTER TABLE "User" ADD COLUMN "featuredProjects" TEXT;
ALTER TABLE "User" ADD COLUMN "directoryVisible" BOOLEAN NOT NULL DEFAULT true;
