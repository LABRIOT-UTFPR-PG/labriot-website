import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/api";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";
import { formatZodErrors, loginPayloadSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const ip = getClientIp(request);
  const ipRateLimit = checkRateLimit({
    key: `login-ip:${ip}`,
    limit: 25,
    windowMs: 10 * 60 * 1000,
  });

  if (!ipRateLimit.success) {
    return rateLimitResponse(ipRateLimit.retryAfter);
  }

  const payload = await request.json();
  const validation = loginPayloadSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Dados invalidos.",
        errors: formatZodErrors(validation.error),
      },
      { status: 400 }
    );
  }

  const normalizedUsername = validation.data.username.trim().toLowerCase();
  const userRateLimit = checkRateLimit({
    key: `login-user-ip:${ip}:${normalizedUsername}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!userRateLimit.success) {
    return rateLimitResponse(userRateLimit.retryAfter);
  }

  const accountRateLimit = checkRateLimit({
    key: `login-account:${normalizedUsername}`,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });

  if (!accountRateLimit.success) {
    return rateLimitResponse(accountRateLimit.retryAfter);
  }

  const user = await prisma.user.findUnique({
    where: { username: validation.data.username },
  });

  if (!user) {
    return NextResponse.json({ message: "Usuario ou senha invalidos." }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(validation.data.password, user.password);

  if (!passwordMatches) {
    return NextResponse.json({ message: "Usuario ou senha invalidos." }, { status: 401 });
  }

  const token = await createAdminSessionToken({ userId: user.id, username: user.username });
  const response = NextResponse.json({ message: "Login realizado com sucesso." });

  resetRateLimit(`login-user-ip:${ip}:${normalizedUsername}`);
  resetRateLimit(`login-account:${normalizedUsername}`);

  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  await recordAdminAudit({
    actor: {
      userId: user.id,
      username: user.username,
    },
    action: "login",
    resourceType: "auth",
    resourceId: user.id,
    resourceLabel: user.username,
    summary: "Realizou login no painel administrativo.",
    ip,
  });

  return response;
}

function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    { message: "Muitas tentativas de login. Tente novamente mais tarde." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    }
  );
}
