import { NextResponse } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5000;

function cleanupExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function normalizeKeyPart(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9:._-]/g, "").slice(0, 160) || "unknown";
}

export function getClientIp(request: Request) {
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    return normalizeKeyPart(vercelForwardedFor.split(",")[0] || "unknown");
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return normalizeKeyPart(forwardedFor.split(",")[0] || "unknown");
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return normalizeKeyPart(realIp);
  }

  const userAgent = request.headers.get("user-agent");
  if (userAgent) {
    return `ua:${normalizeKeyPart(userAgent)}`;
  }

  return "unknown";
}

export function checkRateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  cleanupExpiredBuckets(now);

  if (buckets.size >= MAX_BUCKETS) {
    cleanupExpiredBuckets(now);
  }

  const key = normalizeKeyPart(options.key);
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return {
      success: true,
      retryAfter: 0,
      remaining: Math.max(options.limit - 1, 0),
      resetAt: now + options.windowMs,
    };
  }

  if (bucket.count >= options.limit) {
    return {
      success: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
      remaining: 0,
      resetAt: bucket.resetAt,
    };
  }

  bucket.count += 1;
  return {
    success: true,
    retryAfter: 0,
    remaining: Math.max(options.limit - bucket.count, 0),
    resetAt: bucket.resetAt,
  };
}

export function resetRateLimit(key: string) {
  buckets.delete(normalizeKeyPart(key));
}

export function createRateLimitResponse(retryAfter: number, message: string) {
  return NextResponse.json(
    { message },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    }
  );
}
