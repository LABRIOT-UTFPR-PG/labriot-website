import { NextResponse } from "next/server";

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function canUseMockData() {
  if (isDatabaseConfigured()) {
    return false;
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return process.env.ALLOW_MOCK_DATA !== "false";
}

export function isObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

export function databaseUnavailableResponse() {
  return NextResponse.json(
    { message: "MongoDB nao configurado. Defina DATABASE_URL no .env." },
    { status: 503 }
  );
}

export function invalidIdResponse(resource = "registro") {
  return NextResponse.json({ message: `ID de ${resource} invalido.` }, { status: 400 });
}
