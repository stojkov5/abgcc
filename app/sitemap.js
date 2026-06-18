import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://abgcc.org";

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: baseUrl,                    priority: 1.0,  changeFrequency: "weekly"  },
    { url: `${baseUrl}/about`,         priority: 0.85, changeFrequency: "monthly" },
    { url: `${baseUrl}/services`,      priority: 0.85, changeFrequency: "monthly" },
    { url: `${baseUrl}/membership`,    priority: 0.9,  changeFrequency: "weekly"  },
    { url: `${baseUrl}/members`,       priority: 0.7,  changeFrequency: "weekly"  },
    { url: `${baseUrl}/events`,        priority: 0.9,  changeFrequency: "daily"   },
    { url: `${baseUrl}/news`,          priority: 0.8,  changeFrequency: "daily"   },
    { url: `${baseUrl}/join-our-team`, priority: 0.6,  changeFrequency: "monthly" },
    { url: `${baseUrl}/contact`,       priority: 0.7,  changeFrequency: "yearly"  },
  ].map((page) => ({ ...page, lastModified: new Date() }));

  // Dynamic event pages
  let eventPages = [];
  try {
    const events = await prisma.event.findMany({
      where: { active: true, archived: false },
      select: { slug: true, updatedAt: true },
    });
    eventPages = events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.updatedAt,
      priority: 0.75,
      changeFrequency: "weekly",
    }));
  } catch {
    // DB unavailable during build — skip dynamic pages
  }

  // Dynamic news/blog pages
  let postPages = [];
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    postPages = posts.map((post) => ({
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: post.updatedAt,
      priority: 0.7,
      changeFrequency: "monthly",
    }));
  } catch {
    // DB unavailable during build — skip dynamic pages
  }

  return [...staticPages, ...eventPages, ...postPages];
}
