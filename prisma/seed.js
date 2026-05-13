const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const memberships = [
    {
      title: "Individual Membership",
      description:
        "Access to networking events, newsletters, and premium networking opportunities.",
      price: 199,
      period: "yearly",
    },

    {
      title: "Professional Membership",
      description:
        "Business directory listing, speaking opportunities, and social media promotion.",
      price: 299,
      period: "yearly",
    },

    {
      title: "Family/Business Membership",
      description:
        "Featured business listing, sponsorship opportunities, and workshop access.",
      price: 750,
      period: "yearly",
    },

    {
      title: "Corporate Membership",
      description:
        "Priority sponsorships, feature articles, and dedicated business support.",
      price: 3500,
      period: "yearly",
    },

    {
      title: "Executive Partner Membership",
      description:
        "VIP access, personalized matchmaking, and major event speaking opportunities.",
      price: 10000,
      period: "yearly",
    },
  ];

  for (const membership of memberships) {
    await prisma.membershipTier.upsert({
      where: {
        title: membership.title,
      },

      update: membership,

      create: membership,
    });
  }

  console.log("Membership tiers seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });