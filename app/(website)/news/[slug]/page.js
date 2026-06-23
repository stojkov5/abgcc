export const revalidate = 60;

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { Render } from "@puckeditor/core/rsc";
import { puckConfig } from "@/components/puck/puck.config";
import { parsePuckData, getContentPreview } from "@/lib/puck/preview";

import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/MotionReveal";

import "@/styles/news.css";
import "@/styles/puck-content.css";
import "@/styles/rich-content.css";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
  });

  if (!post) {
    return { title: "Article not found" };
  }

  const description = post.excerpt || getContentPreview(post.content, 160);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `/news/${post.slug}`,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
  });

  if (!post) notFound();

  const puckData = parsePuckData(post.content);

  return (
    <main className="news-article-page">
      <article className="news-article">
        <div className="page-container news-article-inner">
          <Reveal delay={0.05}>
            <Link href="/news" className="news-article-back">
              <ArrowLeft size={16} />
              Back to News
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="news-article-meta">
              <CalendarDays size={15} />
              {formatDate(post.publishedAt)}
              {post.author ? ` · ${post.author}` : ""}
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <h1 className="news-article-title">{post.title}</h1>
          </Reveal>

          {post.excerpt && (
            <Reveal delay={0.22}>
              <p className="news-article-excerpt">{post.excerpt}</p>
            </Reveal>
          )}
        </div>

        {post.coverImage && (
          <Reveal delay={0.26} className="news-article-cover-reveal">
            <div className="news-article-cover">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="news-article-cover-img"
              />
            </div>
          </Reveal>
        )}

        <div className="page-container">
          <Reveal className="news-article-content">
            {puckData ? (
              <div className="puck-content">
                <Render config={puckConfig} data={puckData} />
              </div>
            ) : (
              <div
                className="puck-content rich-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="news-article-footer">
              <Link href="/news" className="news-article-back">
                <ArrowLeft size={16} />
                Back to all news
              </Link>
            </div>
          </Reveal>
        </div>
      </article>
    </main>
  );
}
