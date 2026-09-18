// Seeds the About page "Meet the Team" and "Advisory Board" cards with the
// people that used to be hardcoded in app/(website)/about/page.js. Safe to run
// repeatedly: it skips seeding when TeamMember already has rows.
//
//   node prisma/seed-team.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const team = [
  {
    name: "Eliza Prendzov - President",
    role: "CEO & Co-Founder of Prend Capital",
    image: "/Eliza-Prendzov.webp",
    imagePosition: "center top",
    bio: "A leader in sustainable finance and infrastructure partnership building, with over 20 years of experience across consulting, asset management, finance, sustainability, government, and multilateral relations.",
    linkedin: "https://www.linkedin.com/in/eliza-prendzov/",
    section: "TEAM",
    order: 0,
  },
  {
    name: "Lenard Moxley - Vice President",
    role: "Renewable Energy and Infrastructure",
    image: "/Lenard Moxley.webp",
    imagePosition: "center center",
    bio: "Comes from a renewable energy development and policy background, with experience in wind, solar, and battery storage. He speaks Macedonian fluently and has strong international experience.",
    linkedin: "https://www.linkedin.com/in/lenardcmoxley/",
    section: "TEAM",
    order: 1,
  },
  {
    name: "Charles Moxley - Vice President",
    role: "Finance & Capital Markets",
    image: "/Charles Moxley.webp",
    imagePosition: "center 18%",
    bio: "A finance professional with experience in asset management, financial analysis, capital markets, electricity, and energy markets.",
    linkedin: "https://www.linkedin.com/in/charlesdmoxley/",
    section: "TEAM",
    order: 2,
  },
];

const advisoryBoard = [
  {
    name: "Natasha Sivevska",
    role: "Sustainable Fashion, Circular Economy, Social Compliance",
    image: "/Natasha-Sivevska.webp",
    imagePosition: "center top",
    bio: null,
    linkedin: "https://www.linkedin.com/in/natasha-sivevska",
    section: "ADVISORY",
    order: 0,
  },
  {
    name: "Dame Gloria Starr Kins",
    role: "Business Diplomacy",
    image: "/Gloria-Starr-Kins.webp",
    imagePosition: "center top",
    bio: null,
    linkedin: null,
    section: "ADVISORY",
    order: 1,
  },
  {
    name: "Thakur Aggarwal",
    role: "Government Relations",
    image: "/Thakur-Aggarwal.webp",
    imagePosition: "center top",
    bio: null,
    linkedin: null,
    section: "ADVISORY",
    order: 2,
  },
  {
    name: "Chioma Eze",
    role: "Arts and Business Development",
    image: "/Chioma-Eze.webp",
    imagePosition: "center top",
    bio: null,
    linkedin: "https://www.linkedin.com/in/chioma",
    section: "ADVISORY",
    order: 3,
  },
];

async function main() {
  const existing = await prisma.teamMember.count();

  if (existing > 0) {
    console.log(
      `TeamMember already has ${existing} row(s) — skipping seed to avoid duplicates.`
    );
    return;
  }

  await prisma.teamMember.createMany({
    data: [...team, ...advisoryBoard],
  });

  console.log(
    `Seeded ${team.length} team member(s) and ${advisoryBoard.length} advisory board member(s).`
  );
}

main()
  .catch((error) => {
    console.error("SEED_TEAM_ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
