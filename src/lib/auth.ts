import jwt from "jsonwebtoken";
import { compareSync } from "bcryptjs";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "jeepping-travel-default-secret";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function authenticate(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser } | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const valid = compareSync(password, user.password);
  if (!valid) return null;

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}
