import test from "node:test";
import assert from "node:assert/strict";
import { getAdminExportFilename, isAdminExportScope } from "@/lib/admin-export";

test("accepts only known admin export scopes", () => {
  assert.equal(isAdminExportScope("all"), true);
  assert.equal(isAdminExportScope("projects"), true);
  assert.equal(isAdminExportScope("publications"), true);
  assert.equal(isAdminExportScope("events"), false);
});

test("builds a stable export filename", () => {
  const filename = getAdminExportFilename("projects", new Date("2026-06-12T10:00:00.000Z"));
  assert.equal(filename, "labriot-projects-2026-06-12.json");
});
