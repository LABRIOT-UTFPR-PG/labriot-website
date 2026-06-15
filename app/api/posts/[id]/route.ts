import { NextResponse } from "next/server";
import { recordAdminAudit } from "@/lib/audit";
import {
  databaseUnavailableResponse,
  invalidIdResponse,
  isDatabaseConfigured,
  isObjectId,
} from "@/lib/api";
import { getClientIp } from "@/lib/rate-limit";
import { RepositoryNotFoundError } from "@/lib/repositories/errors";
import { getPostRepository } from "@/lib/repositories/posts";
import { getCurrentAdminActor } from "@/lib/server-admin-session";
import { enforceRequestRateLimit } from "@/lib/request-security";
import { formatZodErrors, postPayloadSchema } from "@/lib/validations/post";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (isDatabaseConfigured() && !isObjectId(id)) {
    return invalidIdResponse("post");
  }

  const post = await getPostRepository().getById(id);

  if (!post) {
    return NextResponse.json({ message: "Post nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const actor = await getCurrentAdminActor();

  if (!actor) {
    return NextResponse.json({ message: "Autenticacao de administrador obrigatoria." }, { status: 401 });
  }

  const { id } = await context.params;

  if (!isObjectId(id)) {
    return invalidIdResponse("post");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "posts:update",
    request,
    ipRule: {
      limit: 120,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 60,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: actor.userId,
    message: "Muitas alteracoes de posts. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const payload = await request.json();
  const validation = postPayloadSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Dados invalidos.",
        errors: formatZodErrors(validation.error),
      },
      { status: 400 }
    );
  }

  try {
    const post = await getPostRepository().update(id, validation.data);
    await recordAdminAudit({
      actor,
      action: "update",
      resourceType: "post",
      resourceId: String(post.id),
      resourceLabel: post.title,
      summary: `Atualizou o post ${post.title}.`,
      ip: getClientIp(request),
    });
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    throw error;
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const actor = await getCurrentAdminActor();

  if (!actor) {
    return NextResponse.json({ message: "Autenticacao de administrador obrigatoria." }, { status: 401 });
  }

  const { id } = await context.params;

  if (!isObjectId(id)) {
    return invalidIdResponse("post");
  }

  const rateLimit = enforceRequestRateLimit({
    scope: "posts:delete",
    request,
    ipRule: {
      limit: 120,
      windowMs: 15 * 60 * 1000,
    },
    identityRule: {
      limit: 60,
      windowMs: 15 * 60 * 1000,
    },
    identityKey: actor.userId,
    message: "Muitas alteracoes de posts. Tente novamente mais tarde.",
  });

  if (rateLimit) {
    return rateLimit;
  }

  const existingPost = await getPostRepository().getById(id);

  if (!existingPost) {
    return NextResponse.json({ message: "Post nao encontrado" }, { status: 404 });
  }

  try {
    await getPostRepository().remove(id);
    await recordAdminAudit({
      actor,
      action: "delete",
      resourceType: "post",
      resourceId: String(existingPost.id),
      resourceLabel: existingPost.title,
      summary: `Excluiu o post ${existingPost.title}.`,
      ip: getClientIp(request),
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof RepositoryNotFoundError) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    throw error;
  }
}
