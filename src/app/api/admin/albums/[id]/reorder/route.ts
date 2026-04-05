import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function checkAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// PUT — reorder photos in album
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  const data: { photoIds: string[] } = await req.json();

  for (let i = 0; i < data.photoIds.length; i++) {
    await prisma.galleryItem.update({
      where: { id: data.photoIds[i] },
      data: { order: i + 1 },
    });
  }

  // First photo becomes album cover
  if (data.photoIds.length > 0) {
    const firstPhoto = await prisma.galleryItem.findUnique({
      where: { id: data.photoIds[0] },
    });
    if (firstPhoto) {
      await prisma.album.update({
        where: { id },
        data: { coverImage: firstPhoto.image },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
