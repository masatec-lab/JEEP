import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Блог",
  description: "Полезные статьи о джиппинге в Адыгее: что взять с собой, лучшие маршруты, советы и лайфхаки.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="pt-20">
      <section className="py-16 sm:py-20 bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
            Блог
          </h1>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl">
            Полезные статьи о джиппинге, маршрутах и отдыхе в Адыгее
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-bg-secondary overflow-hidden transition-all hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-bg-tertiary overflow-hidden">
                    {post.image ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a1a] via-[#0d1f2d] to-[#1a1a1a]" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a2a] via-[#0d1f2d] to-[#1a1a1a]" />
                    )}
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    {post.publishedAt && (
                      <span className="text-xs text-text-muted">
                        {new Date(post.publishedAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    <h2 className="mt-2 text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-semibold text-accent group-hover:gap-3 gap-2 transition-all">
                      Читать
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-text-secondary">Статьи скоро появятся</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
