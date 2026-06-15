import { SignJWT } from "jose/jwt/sign";
import { getAuthSecretValue } from "@/lib/env";
export { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth-session";


function getAuthSecret() {
  return new TextEncoder().encode(getAuthSecretValue());
}

export async function createAdminSessionToken(payload: { userId: string; username: string }) {
  return new SignJWT({
    sub: payload.userId,
    username: payload.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getAuthSecret());
}
