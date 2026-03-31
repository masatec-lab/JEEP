import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function checkAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json();

  const existing = await prisma.blogPost.findUnique({ where: { id } });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      image: data.image || "",
      author: data.author || "Jeepping Travel",
      published: data.published || false,
      publishedAt: data.published && !existing?.publishedAt ? new Date() : existing?.publishedAt,
      order: parseInt(data.order) || 0,
    },
  });
  return NextResponse.json(post);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
