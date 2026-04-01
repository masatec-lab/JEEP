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
  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { order: "asc" } },
    },
  });
  if (!album) {
    return NextResponse.json({ error: "Альбом не найден" }, { status: 404 });
  }
  return NextResponse.json(album);
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
  const album = await prisma.album.update({
    where: { id },
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description || "",
      coverImage: data.coverImage || "",
      order: parseInt(data.order) || 0,
      active: data.active !== false,
    },
  });
  return NextResponse.json(album);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  // Unlink photos (don't delete them)
  await prisma.galleryItem.updateMany({
    where: { albumId: id },
    data: { albumId: null },
  });
  await prisma.album.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
