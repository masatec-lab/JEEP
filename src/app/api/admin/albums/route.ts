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
  const albums = await prisma.album.findMany({
    orderBy: { order: "asc" },
    include: { photos: { select: { id: true } } },
  });
  return NextResponse.json(
    albums.map((a) => ({ ...a, photoCount: a.photos.length, photos: undefined }))
  );
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const data = await req.json();
  const album = await prisma.album.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description || "",
      coverImage: data.coverImage || "",
      order: parseInt(data.order) || 0,
      active: data.active !== false,
    },
  });
  return NextResponse.json(album, { status: 201 });
}
