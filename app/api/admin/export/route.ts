import { NextResponse } from "next/server";
import { getAdminExportFilename, isAdminExportScope, type AdminExportScope } from "@/lib/admin-export";
import { recordAdminAudit } from "@/lib/audit";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/api";
import { getEventRepository } from "@/lib/repositories/events";
import { getPostRepository } from "@/lib/repositories/posts";
import { getProjectRepository } from "@/lib/repositories/projects";
import { getPublicationRepository } from "@/lib/repositories/publications";
import { getResearchRepository } from "@/lib/repositories/research";
import { getSiteSettingsRepository } from "@/lib/repositories/site-settings";
import { getTeamRepository } from "@/lib/repositories/team";
import { getUserRepository } from "@/lib/repositories/users";

async function buildExportPayload(scope: AdminExportScope) {
  if (scope === "projects") {
    return {
      scope,
      exportedAt: new Date().toISOString(),
      projects: await getProjectRepository().list(),
    };
  }

  if (scope === "publications") {
    return {
      scope,
      exportedAt: new Date().toISOString(),
      publications: await getPublicationRepository().list(),
    };
  }

  const [projects, publications, posts, events, team, research, settings, admins] = await Promise.all([
    getProjectRepository().list(),
    getPublicationRepository().list(),
    getPostRepository().list(),
    getEventRepository().list(),
    getTeamRepository().list(),
    getResearchRepository().list(),
    getSiteSettingsRepository().get(),
    getUserRepository().list(),
  ]);

  return {
    scope,
    exportedAt: new Date().toISOString(),
    projects,
    publications,
    posts,
    events,
    team,
    research,
    settings,
    admins,
  };
}

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const { searchParams } = new URL(request.url);
  const scopeParam = searchParams.get("scope") ?? "all";

  if (!isAdminExportScope(scopeParam)) {
    return NextResponse.json({ message: "Escopo de exportacao invalido." }, { status: 400 });
  }

  const payload = await buildExportPayload(scopeParam);

  await recordAdminAudit({
    action: "export",
    resourceType: "data_export",
    resourceLabel: scopeParam,
    summary: `Exportou os dados do escopo ${scopeParam}.`,
  });

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${getAdminExportFilename(scopeParam)}"`,
      "Cache-Control": "no-store",
    },
  });
}
