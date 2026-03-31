"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";

export default function EditBlogPostPage() {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`/api/admin/blog/${params.id}`);
      if (res.ok) {
        setPost(await res.json());
      } else {
        setError("Статья не найдена");
      }
      setLoading(false);
    }
    fetchPost();
  }, [params.id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-text-muted">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-terracotta">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Редактирование статьи</h1>
      <p className="mt-1 text-sm text-text-muted">{post?.title}</p>
      <div className="mt-6">
        {post && <BlogForm initial={post} />}
      </div>
    </div>
  );
}
