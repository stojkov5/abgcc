const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.event.upsert({
    where: {
      slug: "unga-week-2025",
    },

    update: {},

    create: {
      title: "Chamber UNGA Week 2025",

      slug: "unga-week-2025",

      description:
        "A high-level gathering connecting business leaders, investors, diplomats, innovators, and institutions across the United States, the Balkans, and global markets.",

      location: "New York City",

      image: "/events/unga-week/image1.jpg",

      price: 0,

      capacity: 250,

      active: true,

      featured: true,

      startDate: new Date("2025-09-20T18:00:00.000Z"),
    },
  });

  console.log("Event seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });