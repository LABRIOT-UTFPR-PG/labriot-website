import { NextResponse } from "next/server";
import { buildOpenApiDocument } from "@/lib/openapi";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  return NextResponse.json(buildOpenApiDocument(origin), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
