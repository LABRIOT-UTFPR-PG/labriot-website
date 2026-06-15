import { NextRequest, NextResponse } from "next/server";
import { enforceRequestRateLimit, isSameOriginRequest, rejectCrossOriginRequest } from "@/lib/request-security";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth-session";

const PUBLIC_API_PATHS = new Set(["/api/auth/login", "/api/contact", "/api/roboflow"]);
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return handleApiRequest(request);
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  return requireAdminSession(request, () => redirectToLogin(request));
}

async function handleApiRequest(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (WRITE_METHODS.has(request.method) && !PUBLIC_API_PATHS.has(pathname) && !isSameOriginRequest(request)) {
    return rejectCrossOriginRequest(request);
  }

  if (WRITE_METHODS.has(request.method)) {
    const coarseLimit = enforceRequestRateLimit({
      scope: `api-write:${pathname}`,
      request,
      ipRule: {
        limit: 300,
        windowMs: 15 * 60 * 1000,
      },
      message: "Muitas requisicoes de escrita. Tente novamente mais tarde.",
    });

    if (coarseLimit) {
      return coarseLimit;
    }
  }

  if (PUBLIC_API_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  return requireAdminSession(request, () =>
    NextResponse.json({ message: "Autenticacao de administrador obrigatoria." }, { status: 401 })
  );
}

async function requireAdminSession(
  request: NextRequest,
  onUnauthorized: () => NextResponse
) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return onUnauthorized();
  }

  try {
    await verifyAdminSessionToken(token);
    return NextResponse.next();
  } catch {
    return onUnauthorized();
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
