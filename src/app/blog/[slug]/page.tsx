import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug } from "@/lib/data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) notFound();

  return (
    <main className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-bg-secondary border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-accent transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-accent transition-colors">
              Блог
            </Link>
            <span>/</span>
            <span className="text-text-secondary">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-12 sm:py-16 bg-bg-secondary">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {post.publishedAt && (
            <span className="text-sm text-text-muted">
              {new Date(post.publishedAt).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" · "}
              {post.author}
            </span>
          )}
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 bg-bg-primary">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-text-primary prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-text-secondary prose-p:leading-relaxed
              prose-li:text-text-secondary
              prose-strong:text-text-primary
              prose-ul:space-y-2
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Back to blog */}
      <section className="py-12 bg-bg-secondary border-t border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Все статьи
          </Link>
        </div>
      </section>
    </main>
  );
}
