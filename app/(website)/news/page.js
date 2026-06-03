export const revalidate = 60;

export const metadata = {
  title: "News & Insights",
  description:
    "The latest news, announcements, and insights from the American Balkan Global Chamber of Commerce — events, partnerships, and developments across the US and the Balkans.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "News & Insights | ABGCC",
    description:
      "The latest news, announcements, and insights from the American Balkan Global Chamber of Commerce.",
    url: "/news",
  },
};

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getContentPreview } from "@/lib/puck/preview";
import { Reveal, Stagger, StaggerItem } from "@/components/MotionReveal";

import "@/styles/news.css";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function NewsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="news-page">
      <section className="news-hero">
        <div className="page-container">
          <Reveal>
            <p className="section-label">News & Insights</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="news-hero-title">
              Stories, announcements, and insights from ABGCC.
            </h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="news-hero-text">
              Follow the latest developments, events, and partnerships shaping
              business and cultural ties between the United States, the Balkans,
              and global markets.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="news-list-section">
        <div className="page-container">
          {posts.length > 0 ? (
            <Stagger className="news-grid">
              {posts.map((post) => (
                <StaggerItem as="article" key={post.id} className="news-card">
                  <Link href={`/news/${post.slug}`} className="news-card-link">
                    <div className="news-card-image">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                          className="news-card-img"
                        />
                      ) : (
                        <div className="news-card-img-placeholder">
                          <span>ABGCC</span>
                        </div>
                      )}
                    </div>

                    <div className="news-card-body">
                      <span className="news-card-date">
                        <CalendarDays size={15} />
                        {formatDate(post.publishedAt)}
                      </span>

                      <h2 className="news-card-title">{post.title}</h2>

                      <p className="news-card-excerpt">
                        {post.excerpt || getContentPreview(post.content)}
                      </p>

                      <span className="news-card-readmore">
                        Read article <ArrowRight size={15} />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Reveal className="news-empty">
              <span className="section-label">No Articles</span>
              <h2>No news published yet.</h2>
              <p>Please check back soon for the latest ABGCC news and insights.</p>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  );
}
