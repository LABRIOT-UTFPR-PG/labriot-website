import assert from "node:assert/strict"
import test from "node:test"
import { NextRequest } from "next/server"
import { canUseMockData } from "@/lib/api"
import { getAuthSecretValue, getRoboflowApiKey } from "@/lib/env"
import { createAdminSessionToken, verifyAdminSessionToken } from "@/lib/auth"
import { updateAdminPasswordPayloadSchema } from "@/lib/validations/auth"
import { siteSettingsPayloadSchema } from "@/lib/validations/site-settings"
import { middleware } from "@/middleware"

function restoreEnv(snapshot: NodeJS.ProcessEnv) {
  for (const key of Object.keys(process.env)) {
    if (!(key in snapshot)) {
      delete process.env[key]
    }
  }

  Object.assign(process.env, snapshot)
}

test("auth token roundtrip preserva id e username do admin", async () => {
  const snapshot = { ...process.env }
  process.env.AUTH_SECRET = "test-secret-123"

  try {
    const token = await createAdminSessionToken({
      userId: "admin-id",
      username: "admin-user",
    })

    const payload = await verifyAdminSessionToken(token)

    assert.equal(payload.sub, "admin-id")
    assert.equal(payload.username, "admin-user")
  } finally {
    restoreEnv(snapshot)
  }
})

test("middleware deixa rota publica do roboflow passar sem autenticacao", async () => {
  const response = await middleware(new NextRequest("http://localhost:3000/api/roboflow", { method: "POST" }))
  assert.equal(response.status, 200)
})

test("middleware deixa rota publica de contato passar sem autenticacao", async () => {
  const response = await middleware(new NextRequest("http://localhost:3000/api/contact", { method: "POST" }))
  assert.equal(response.status, 200)
})

test("middleware bloqueia rota privada de API sem sessao", async () => {
  const response = await middleware(new NextRequest("http://localhost:3000/api/projects"))
  assert.equal(response.status, 401)
})

test("middleware redireciona pagina admin sem sessao para login", async () => {
  const response = await middleware(new NextRequest("http://localhost:3000/admin/projects"))
  assert.equal(response.status, 307)
  assert.equal(response.headers.get("location"), "http://localhost:3000/admin/login?next=%2Fadmin%2Fprojects")
})

test("middleware permite rota privada com sessao valida", async () => {
  const snapshot = { ...process.env }
  process.env.AUTH_SECRET = "test-secret-123"

  try {
    const token = await createAdminSessionToken({
      userId: "admin-id",
      username: "admin-user",
    })

    const request = new NextRequest("http://localhost:3000/api/projects", {
      headers: {
        cookie: `labriot_admin_session=${token}`,
      },
    })

    const response = await middleware(request)
    assert.equal(response.status, 200)
  } finally {
    restoreEnv(snapshot)
  }
})

test("site settings exige email valido e links http(s)", () => {
  const result = siteSettingsPayloadSchema.safeParse({
    siteName: "Labriot",
    siteDescription: "Descricao valida",
    contactEmail: "email-invalido",
    contactPhone: "42 99999-9999",
    contactAddress: "Rua X",
    socialMedia: {
      twitter: "notaurl",
      linkedin: "",
      github: "https://github.com/labriot",
    },
    enableBlog: true,
    enableEvents: true,
    enableNewsletter: true,
  })

  assert.equal(result.success, false)
})

test("troca de senha rejeita confirmacao diferente e repeticao da senha atual", () => {
  const result = updateAdminPasswordPayloadSchema.safeParse({
    currentPassword: "12345678",
    newPassword: "12345678",
    confirmPassword: "87654321",
  })

  assert.equal(result.success, false)
})

test("mock data so e permitido fora de producao", () => {
  const snapshot = { ...process.env }

  try {
    const env = process.env as Record<string, string | undefined>
    delete process.env.DATABASE_URL
    env.NODE_ENV = "development"
    delete process.env.ALLOW_MOCK_DATA
    assert.equal(canUseMockData(), true)

    env.NODE_ENV = "production"
    assert.equal(canUseMockData(), false)

    env.NODE_ENV = "development"
    process.env.ALLOW_MOCK_DATA = "false"
    assert.equal(canUseMockData(), false)
  } finally {
    restoreEnv(snapshot)
  }
})

test("auth secret usa fallback so fora de producao", () => {
  const snapshot = { ...process.env }

  try {
    const env = process.env as Record<string, string | undefined>
    delete process.env.AUTH_SECRET
    delete process.env.JWT_SECRET
    env.NODE_ENV = "development"
    assert.equal(getAuthSecretValue(), "labriot-dev-secret-change-me")

    env.NODE_ENV = "production"
    assert.throws(() => getAuthSecretValue(), /AUTH_SECRET/)
  } finally {
    restoreEnv(snapshot)
  }
})

test("roboflow api key e obrigatoria quando solicitada", () => {
  const snapshot = { ...process.env }

  try {
    delete process.env.API_KEY
    assert.throws(() => getRoboflowApiKey(), /API_KEY/)

    process.env.API_KEY = "rf-test"
    assert.equal(getRoboflowApiKey(), "rf-test")
  } finally {
    restoreEnv(snapshot)
  }
})
