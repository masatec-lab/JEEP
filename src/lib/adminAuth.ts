import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AuthUser } from "./auth";

export function requireAdmin(
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Невалидный токен" }, { status: 401 });
    }

    return handler(req, user);
  };
}
