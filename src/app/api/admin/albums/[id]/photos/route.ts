import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function checkAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// POST — add uploaded photo to album
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json();

  const album = await prisma.album.findUnique({ where: { id } });
  if (!album) {
    return NextResponse.json({ error: "Альбом не найден" }, { status: 404 });
  }

  const photoCount = await prisma.galleryItem.count({ where: { albumId: id } });

  const photo = await prisma.galleryItem.create({
    data: {
      image: data.image,
      alt: data.alt || "",
      span: "",
      category: "album",
      albumId: id,
      order: photoCount + 1,
      active: true,
    },
  });

  // Set as cover if it's the first photo
  if (photoCount === 0) {
    await prisma.album.update({
      where: { id },
      data: { coverImage: data.image },
    });
  }

  return NextResponse.json(photo, { status: 201 });
}
