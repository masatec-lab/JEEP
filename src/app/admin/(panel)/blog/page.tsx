"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  published: boolean;
  publishedAt: string | null;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const res = await fetch("/api/admin/blog");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить статью "${title}"?`)) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) setPosts(posts.filter((p) => p.id !== id));
  };

  const togglePublished = async (post: BlogPost) => {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, published: !post.published }),
    });
    fetchPosts();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-text-muted">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Блог</h1>
          <p className="mt-1 text-sm text-text-muted">{posts.length} статей</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary hover:bg-accent-hover transition-colors"
        >
          + Новая статья
        </Link>
      </div>

      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-secondary border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Заголовок</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Автор</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Дата</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Статус</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-muted uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((post) => (
              <tr key={post.id} className={`hover:bg-bg-secondary/50 transition-colors ${!post.published ? "opacity-50" : ""}`}>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-text-primary">{post.title}</div>
                  <div className="text-xs text-text-muted">/{post.slug}</div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{post.author}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("ru-RU")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePublished(post)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.published ? "bg-green/10 text-green" : "bg-bg-tertiary text-text-muted"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${post.published ? "bg-green" : "bg-text-muted"}`} />
                    {post.published ? "Опубликована" : "Черновик"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-terracotta hover:text-terracotta transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
