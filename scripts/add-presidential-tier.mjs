import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const existing = await prisma.membershipTier.findFirst({
  where: { title: { contains: "Presidential", mode: "insensitive" } },
});

if (existing) {
  console.log("Already exists:", existing.id, existing.title);
} else {
  const tier = await prisma.membershipTier.create({
    data: {
      title: "Presidential Circle",
      description:
        "ABGCC's highest level of membership, providing unparalleled access, visibility, strategic engagement, and leadership opportunities across our global network. Limited to a select group of strategic partners.",
      price: 50000,
      period: "Yearly",
      active: true,
    },
  });
  console.log("Created Presidential Circle tier:", tier.id);
}

await prisma.$disconnect();
