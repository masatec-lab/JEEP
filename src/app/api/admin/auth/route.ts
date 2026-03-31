import { NextRequest, NextResponse } from "next/server";
import { authenticate, verifyToken } from "@/lib/auth";

// POST /api/admin/auth — login
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email и пароль обязательны" },
      { status: 400 }
    );
  }

  const result = await authenticate(email, password);

  if (!result) {
    return NextResponse.json(
      { error: "Неверный email или пароль" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ user: result.user });

  response.cookies.set("admin_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}

// GET /api/admin/auth — check session
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Невалидный токен" }, { status: 401 });
  }

  return NextResponse.json({ user });
}

// DELETE /api/admin/auth — logout
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("admin_token");
  return response;
}
