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
  const photos = await prisma.galleryItem.findMany({
    where: { routeId: id },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(photos);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json();

  const count = await prisma.galleryItem.count({ where: { routeId: id } });

  const photo = await prisma.galleryItem.create({
    data: {
      image: data.image,
      alt: data.alt || "",
      span: "",
      category: "route",
      routeId: id,
      order: count + 1,
      active: true,
    },
  });

  // If first photo and route has no main image, set it
  if (count === 0) {
    const route = await prisma.route.findUnique({ where: { id }, select: { image: true } });
    if (!route?.image || route.image === "") {
      await prisma.route.update({ where: { id }, data: { image: data.image } });
    }
  }

  return NextResponse.json(photo, { status: 201 });
}
