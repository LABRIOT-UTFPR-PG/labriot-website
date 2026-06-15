import { NextResponse } from "next/server";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/rate-limit";

type RateLimitRule = {
  limit: number;
  windowMs: number;
};

type RequestRateLimitOptions = {
  scope: string;
  request: Request;
  ipRule?: RateLimitRule;
  identityRule?: RateLimitRule;
  identityKey?: string | null;
  message?: string;
};

export function enforceRequestRateLimit(options: RequestRateLimitOptions) {
  const { request, scope, ipRule, identityRule, identityKey, message } = options;
  const ip = getClientIp(request);

  if (ipRule) {
    const ipLimit = checkRateLimit({
      key: `${scope}:ip:${ip}`,
      limit: ipRule.limit,
      windowMs: ipRule.windowMs,
    });

    if (!ipLimit.success) {
      return createRateLimitResponse(
        ipLimit.retryAfter,
        message ?? "Muitas tentativas. Tente novamente mais tarde."
      );
    }
  }

  if (identityRule && identityKey) {
    const normalizedIdentity = identityKey.trim().toLowerCase();

    if (normalizedIdentity) {
      const identityLimit = checkRateLimit({
        key: `${scope}:identity:${normalizedIdentity}`,
        limit: identityRule.limit,
        windowMs: identityRule.windowMs,
      });

      if (!identityLimit.success) {
        return createRateLimitResponse(
          identityLimit.retryAfter,
          message ?? "Muitas tentativas. Tente novamente mais tarde."
        );
      }
    }
  }

  return null;
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  if (!/^https?:\/\//i.test(origin)) {
    return true;
  }

  const allowedHosts = new Set(
    [
      request.headers.get("x-forwarded-host"),
      request.headers.get("host"),
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ].filter((value): value is string => Boolean(value))
  );

  if (allowedHosts.size === 0) {
    return false;
  }

  try {
    return allowedHosts.has(new URL(origin).host);
  } catch {
    return false;
  }
}

export function rejectCrossOriginRequest(_request: Request) {
  return NextResponse.json(
    { message: "Origem nao autorizada." },
    { status: 403 }
  );
}
