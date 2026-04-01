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

  await params; // validate params exist
  const data: { photoIds: string[] } = await req.json();

  for (let i = 0; i < data.photoIds.length; i++) {
    await prisma.galleryItem.update({
      where: { id: data.photoIds[i] },
      data: { order: i + 1 },
    });
  }

  return NextResponse.json({ ok: true });
}
