import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function checkAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const data: { routeIds: string[] } = await req.json();

  for (let i = 0; i < data.routeIds.length; i++) {
    await prisma.route.update({
      where: { id: data.routeIds[i] },
      data: { order: i + 1 },
    });
  }

  return NextResponse.json({ ok: true });
}
