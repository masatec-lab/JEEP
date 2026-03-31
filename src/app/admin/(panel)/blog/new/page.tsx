import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Новая статья</h1>
      <p className="mt-1 text-sm text-text-muted">Напишите статью для блога</p>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
