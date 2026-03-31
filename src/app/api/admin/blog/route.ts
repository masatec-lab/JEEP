import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function checkAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const posts = await prisma.blogPost.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const data = await req.json();
  const post = await prisma.blogPost.create({
    data: {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      image: data.image || "",
      author: data.author || "Jeepping Travel",
      published: data.published || false,
      publishedAt: data.published ? new Date() : null,
      order: parseInt(data.order) || 0,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
