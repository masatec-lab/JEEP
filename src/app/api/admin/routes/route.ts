import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function checkAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/admin/routes — list all routes
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const routes = await prisma.route.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(routes);
}

// POST /api/admin/routes — create route
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const data = await req.json();

  const route = await prisma.route.create({
    data: {
      slug: data.slug,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      price: parseInt(data.price),
      priceNote: data.priceNote || "за машину (до 6 чел.)",
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

  return NextResponse.json(route, { status: 201 });
}
