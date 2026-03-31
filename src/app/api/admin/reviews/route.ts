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
  const reviews = await prisma.review.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const data = await req.json();
  const review = await prisma.review.create({
    data: {
      name: data.name,
      date: data.date,
      rating: parseInt(data.rating),
      text: data.text,
      route: data.route,
      avatar: data.avatar || null,
      active: data.active !== false,
      order: parseInt(data.order) || 0,
    },
  });
  return NextResponse.json(review, { status: 201 });
}
