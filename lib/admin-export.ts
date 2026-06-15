export const adminExportScopes = ["all", "projects", "publications"] as const;

export type AdminExportScope = (typeof adminExportScopes)[number];

export function isAdminExportScope(value: string): value is AdminExportScope {
  return adminExportScopes.includes(value as AdminExportScope);
}

export function getAdminExportFilename(scope: AdminExportScope, now = new Date()) {
  const date = now.toISOString().slice(0, 10);
  return `labriot-${scope}-${date}.json`;
}
