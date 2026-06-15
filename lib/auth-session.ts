import { jwtVerify } from "jose/jwt/verify";
import { getAuthSecretValue } from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "labriot_admin_session";

function getAuthSecret() {
  return new TextEncoder().encode(getAuthSecretValue());
}

export async function verifyAdminSessionToken(token: string) {
  const { payload } = await jwtVerify(token, getAuthSecret());
  return payload;
}
