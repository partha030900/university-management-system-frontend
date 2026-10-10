import type { AuthUser } from "@/types/auth";

interface JwtPayload {
  id: number;
  email: string;
  role: AuthUser["role"];
  iat: number;
  exp: number;
}

export function decodeAccessToken(token: string): AuthUser {
  const payload = token.split(".")[1];

  if (!payload) {
    throw new Error("Invalid access token");
  }

  const decodedPayload = JSON.parse(
    atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
  ) as JwtPayload;

  return {
    id: decodedPayload.id,
    email: decodedPayload.email,
    role: decodedPayload.role,
  };
}