import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function checkAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/admin/routes/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  const route = await prisma.route.findUnique({ where: { id } });

  if (!route) {
    return NextResponse.json({ error: "Маршрут не найден" }, { status: 404 });
  }

  return NextResponse.json(route);
}

// PUT /api/admin/routes/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  const data = await req.json();

  const route = await prisma.route.update({
    where: { id },
    data: {
      slug: data.slug,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      price: parseInt(data.price),
      priceNote: data.priceNote,
      duration: data.duration,
      difficulty: parseInt(data.difficulty),
      difficultyLabel: data.difficultyLabel,
      maxPassengers: parseInt(data.maxPassengers),
      highlights: JSON.stringify(data.highlights || []),
      included: JSON.stringify(data.included || []),
      image: data.image || "",
      gallery: JSON.stringify(data.gallery || []),
      startPoint: data.startPoint,
      popular: data.popular || false,
      order: parseInt(data.order) || 0,
      active: data.active !== false,
    },
  });

  return NextResponse.json(route);
}

// DELETE /api/admin/routes/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.route.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
