type OpenApiDocument = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  tags: Array<{
    name: string;
    description: string;
  }>;
  components: {
    securitySchemes: Record<string, unknown>;
    schemas: Record<string, unknown>;
  };
  paths: Record<string, unknown>;
};

const adminCookieSecurity = [{ adminSessionCookie: [] }];

function jsonRequest(schemaName: string, required = true) {
  return {
    required,
    content: {
      "application/json": {
        schema: {
          $ref: `#/components/schemas/${schemaName}`,
        },
      },
    },
  };
}

function jsonResponse(description: string, schemaName: string) {
  return {
    description,
    content: {
      "application/json": {
        schema: {
          $ref: `#/components/schemas/${schemaName}`,
        },
      },
    },
  };
}

function errorResponse(description: string, exampleMessage: string) {
  return {
    description,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorMessage",
        },
        examples: {
          default: {
            value: {
              message: exampleMessage,
            },
          },
        },
      },
    },
  };
}

function validationErrorResponse() {
  return {
    description: "Payload invalido.",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ValidationErrorResponse",
        },
      },
    },
  };
}

function commonProtectedResponses(notFoundMessage: string) {
  return {
    "400": errorResponse("ID invalido ou payload invalido.", "ID de registro invalido."),
    "401": errorResponse(
      "Sessao administrativa ausente ou invalida.",
      "Autenticacao de administrador obrigatoria."
    ),
    "404": errorResponse("Registro nao encontrado.", notFoundMessage),
    "503": errorResponse(
      "Banco indisponivel ou nao configurado.",
      "MongoDB nao configurado. Defina DATABASE_URL no .env."
    ),
  };
}

export function buildOpenApiDocument(baseUrl: string): OpenApiDocument {
  return {
    openapi: "3.1.0",
    info: {
      title: "Labriot Website API",
      version: "1.0.0",
      description:
        "Documentacao Swagger/OpenAPI das rotas administrativas e de integracao do Labriot. Quase todas as rotas usam autenticacao por cookie (`labriot_admin_session`); apenas login e Roboflow sao publicas.",
    },
    servers: [
      {
        url: baseUrl,
        description: "Servidor atual",
      },
    ],
    tags: [
      { name: "Auth", description: "Autenticacao do painel administrativo." },
      { name: "Admins", description: "Gestao de administradores e auditoria." },
      { name: "Settings", description: "Configuracoes gerais do site." },
      { name: "Projects", description: "CRUD de projetos." },
      { name: "Team", description: "CRUD de membros da equipe." },
      { name: "Attendance", description: "Controle administrativo de presenca em reunioes." },
      { name: "Publications", description: "CRUD de publicacoes." },
      { name: "Posts", description: "CRUD de posts do blog." },
      { name: "Events", description: "CRUD de eventos." },
      { name: "Research", description: "CRUD de pesquisas." },
      { name: "Export", description: "Exportacao de dados administrativos." },
      {
        name: "Integracoes Externas",
        description: "Rotas que apenas intermediam servicos externos e nao fazem parte do nucleo do backend.",
      },
      { name: "Docs", description: "Endpoint JSON da propria documentacao." },
    ],
    components: {
      securitySchemes: {
        adminSessionCookie: {
          type: "apiKey",
          in: "cookie",
          name: "labriot_admin_session",
          description: "Cookie de sessao do administrador.",
        },
      },
      schemas: {
        ErrorMessage: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
          required: ["message"],
        },
        ValidationErrorItem: {
          type: "object",
          properties: {
            field: { type: "string" },
            message: { type: "string" },
          },
          required: ["field", "message"],
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Dados invalidos." },
            errors: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ValidationErrorItem",
              },
            },
          },
          required: ["message", "errors"],
        },
        LoginPayload: {
          type: "object",
          properties: {
            username: { type: "string", maxLength: 80, example: "admin" },
            password: { type: "string", maxLength: 200, example: "123123123" },
          },
          required: ["username", "password"],
        },
        LoginSuccess: {
          type: "object",
          properties: {
            message: { type: "string", example: "Login realizado com sucesso." },
          },
          required: ["message"],
        },
        CreateAdminPayload: {
          type: "object",
          properties: {
            username: {
              type: "string",
              minLength: 3,
              maxLength: 80,
              pattern: "^[a-zA-Z0-9._-]+$",
              example: "novo.admin",
            },
            password: {
              type: "string",
              minLength: 8,
              maxLength: 200,
              example: "senha-super-segura",
            },
          },
          required: ["username", "password"],
        },
        UpdateAdminPasswordPayload: {
          type: "object",
          properties: {
            currentPassword: { type: "string", maxLength: 200 },
            newPassword: { type: "string", minLength: 8, maxLength: 200 },
            confirmPassword: { type: "string", maxLength: 200 },
          },
          required: ["currentPassword", "newPassword", "confirmPassword"],
        },
        AdminUser: {
          type: "object",
          properties: {
            id: { type: "string", example: "684b815a1f63ab0dd3d4dbea" },
            username: { type: "string", example: "admin" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "username", "createdAt", "updatedAt"],
        },
        AuditLog: {
          type: "object",
          properties: {
            id: { type: "string" },
            adminUserId: { type: "string" },
            adminUsername: { type: "string" },
            action: { type: "string", example: "update" },
            resourceType: { type: "string", example: "project" },
            resourceId: { type: ["string", "null"] },
            resourceLabel: { type: ["string", "null"] },
            summary: { type: "string" },
            ip: { type: ["string", "null"] },
            createdAt: { type: "string", format: "date-time" },
          },
          required: [
            "id",
            "adminUserId",
            "adminUsername",
            "action",
            "resourceType",
            "resourceId",
            "resourceLabel",
            "summary",
            "ip",
            "createdAt",
          ],
        },
        AdminUsersResponse: {
          type: "object",
          properties: {
            users: {
              type: "array",
              items: { $ref: "#/components/schemas/AdminUser" },
            },
            auditLogs: {
              type: "array",
              items: { $ref: "#/components/schemas/AuditLog" },
            },
            currentUserId: { type: ["string", "null"] },
          },
          required: ["users", "auditLogs", "currentUserId"],
        },
        TeamPayload: {
          type: "object",
          properties: {
            name: { type: "string", maxLength: 120 },
            role: { type: ["string", "null"], maxLength: 120 },
            specialization: { type: ["string", "null"], maxLength: 160 },
            category: {
              type: "string",
              maxLength: 120,
              default: "students",
            },
            image: { type: ["string", "null"], maxLength: 500 },
            linkedin: { type: ["string", "null"], maxLength: 500 },
          },
          required: ["name"],
        },
        TeamMember: {
          allOf: [
            { $ref: "#/components/schemas/TeamPayload" },
            {
              type: "object",
              properties: {
                id: { type: ["string", "number"] },
              },
              required: ["id"],
            },
          ],
        },
        ProjectPayload: {
          type: "object",
          properties: {
            title: { type: "string", maxLength: 160 },
            description: { type: ["string", "null"], maxLength: 500 },
            status: {
              type: "string",
              enum: ["ongoing", "completed", "planned"],
              default: "ongoing",
            },
            startDate: { type: ["string", "null"], format: "date" },
            endDate: { type: ["string", "null"], format: "date" },
            image: { type: ["string", "null"], maxLength: 500 },
            url: { type: ["string", "null"], maxLength: 500 },
            fullDescription: { type: ["string", "null"], maxLength: 5000 },
          },
          required: ["title"],
        },
        Project: {
          allOf: [
            { $ref: "#/components/schemas/ProjectPayload" },
            {
              type: "object",
              properties: {
                id: { type: ["string", "number"] },
              },
              required: ["id"],
            },
          ],
        },
        ResearchPayload: {
          type: "object",
          properties: {
            title: { type: "string", maxLength: 180 },
            description: { type: ["string", "null"], maxLength: 2000 },
          },
          required: ["title"],
        },
        Research: {
          allOf: [
            { $ref: "#/components/schemas/ResearchPayload" },
            {
              type: "object",
              properties: {
                id: { type: ["string", "number"] },
              },
              required: ["id"],
            },
          ],
        },
        PublicationPayload: {
          type: "object",
          properties: {
            title: { type: "string", maxLength: 240 },
            authors: { type: "string", maxLength: 400 },
            journal: { type: ["string", "null"], maxLength: 240 },
            year: {
              type: "integer",
              minimum: 1900,
              maximum: 2100,
              example: 2026,
            },
            doi: { type: ["string", "null"], maxLength: 200 },
            description: { type: ["string", "null"], maxLength: 3000 },
          },
          required: ["title", "authors", "year"],
        },
        Publication: {
          allOf: [
            { $ref: "#/components/schemas/PublicationPayload" },
            {
              type: "object",
              properties: {
                id: { type: ["string", "number"] },
              },
              required: ["id"],
            },
          ],
        },
        PostPayload: {
          type: "object",
          properties: {
            title: { type: "string", maxLength: 180 },
            summary: { type: ["string", "null"], maxLength: 400 },
            content: { type: "string", maxLength: 20000 },
            author: { type: ["string", "null"], maxLength: 120 },
            date: { type: "string", format: "date" },
            image: { type: ["string", "null"], maxLength: 500 },
          },
          required: ["title", "content", "date"],
        },
        Post: {
          allOf: [
            { $ref: "#/components/schemas/PostPayload" },
            {
              type: "object",
              properties: {
                id: { type: ["string", "number"] },
              },
              required: ["id"],
            },
          ],
        },
        EventPayload: {
          type: "object",
          properties: {
            title: { type: "string", maxLength: 160 },
            description: { type: ["string", "null"], maxLength: 1200 },
            date: { type: "string", format: "date" },
            time: { type: ["string", "null"], example: "14:30" },
            location: { type: ["string", "null"], maxLength: 200 },
            status: {
              type: "string",
              enum: ["Proximo", "Realizado", "Cancelado"],
              default: "Proximo",
            },
          },
          required: ["title", "date"],
        },
        Event: {
          allOf: [
            { $ref: "#/components/schemas/EventPayload" },
            {
              type: "object",
              properties: {
                id: { type: ["string", "number"] },
              },
              required: ["id"],
            },
          ],
        },
        AttendanceSessionPayload: {
          type: "object",
          properties: {
            title: { type: "string", maxLength: 160, example: "Reuniao semanal" },
            date: { type: "string", format: "date" },
            summary: { type: ["string", "null"], maxLength: 1000 },
          },
          required: ["title", "date"],
        },
        AttendanceRecordPayload: {
          type: "object",
          properties: {
            memberId: { type: "string" },
            present: { type: "boolean" },
            active: { type: "boolean" },
            notes: {
              type: ["string", "null"],
              maxLength: 1200,
              example: "Membro esta ativo e fazendo tasks do projeto.",
            },
          },
          required: ["memberId", "present", "active"],
        },
        AttendanceSessionUpdatePayload: {
          allOf: [
            { $ref: "#/components/schemas/AttendanceSessionPayload" },
            {
              type: "object",
              properties: {
                records: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AttendanceRecordPayload" },
                },
              },
              required: ["records"],
            },
          ],
        },
        AttendanceRecord: {
          allOf: [
            { $ref: "#/components/schemas/AttendanceRecordPayload" },
            {
              type: "object",
              properties: {
                id: { type: "string" },
                sessionId: { type: "string" },
                memberName: { type: "string" },
                memberRole: { type: ["string", "null"] },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
              required: ["id", "sessionId", "memberName", "createdAt", "updatedAt"],
            },
          ],
        },
        AttendanceSession: {
          allOf: [
            { $ref: "#/components/schemas/AttendanceSessionPayload" },
            {
              type: "object",
              properties: {
                id: { type: "string" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
                totalMembers: { type: "integer" },
                presentCount: { type: "integer" },
                activeCount: { type: "integer" },
                records: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AttendanceRecord" },
                },
              },
              required: [
                "id",
                "createdAt",
                "updatedAt",
                "totalMembers",
                "presentCount",
                "activeCount",
                "records",
              ],
            },
          ],
        },
        AttendanceListResponse: {
          type: "object",
          properties: {
            sessions: {
              type: "array",
              items: { $ref: "#/components/schemas/AttendanceSession" },
            },
            team: {
              type: "array",
              items: { $ref: "#/components/schemas/TeamMember" },
            },
          },
          required: ["sessions", "team"],
        },
        SocialMedia: {
          type: "object",
          properties: {
            twitter: { type: ["string", "null"], maxLength: 500 },
            linkedin: { type: ["string", "null"], maxLength: 500 },
            github: { type: ["string", "null"], maxLength: 500 },
          },
          required: ["twitter", "linkedin", "github"],
        },
        SiteSettingsPayload: {
          type: "object",
          properties: {
            siteName: { type: "string", maxLength: 120 },
            siteDescription: { type: "string", maxLength: 500 },
            contactEmail: { type: "string", format: "email", maxLength: 200 },
            contactPhone: { type: "string", maxLength: 100 },
            contactAddress: { type: "string", maxLength: 500 },
            socialMedia: { $ref: "#/components/schemas/SocialMedia" },
            enableBlog: { type: "boolean" },
            enableEvents: { type: "boolean" },
            enableNewsletter: { type: "boolean" },
          },
          required: [
            "siteName",
            "siteDescription",
            "contactEmail",
            "contactPhone",
            "contactAddress",
            "socialMedia",
            "enableBlog",
            "enableEvents",
            "enableNewsletter",
          ],
        },
        SiteSettings: {
          allOf: [
            { $ref: "#/components/schemas/SiteSettingsPayload" },
            {
              type: "object",
              properties: {
                id: { type: "string", example: "site-settings" },
              },
              required: ["id"],
            },
          ],
        },
        ExportPayload: {
          type: "object",
          properties: {
            scope: {
              type: "string",
              enum: ["all", "projects", "publications"],
            },
            exportedAt: { type: "string", format: "date-time" },
            projects: {
              type: "array",
              items: { $ref: "#/components/schemas/Project" },
            },
            publications: {
              type: "array",
              items: { $ref: "#/components/schemas/Publication" },
            },
            posts: {
              type: "array",
              items: { $ref: "#/components/schemas/Post" },
            },
            events: {
              type: "array",
              items: { $ref: "#/components/schemas/Event" },
            },
            team: {
              type: "array",
              items: { $ref: "#/components/schemas/TeamMember" },
            },
            research: {
              type: "array",
              items: { $ref: "#/components/schemas/Research" },
            },
            settings: {
              oneOf: [
                { $ref: "#/components/schemas/SiteSettings" },
                { type: "null" },
              ],
            },
            admins: {
              type: "array",
              items: { $ref: "#/components/schemas/AdminUser" },
            },
          },
          required: ["scope", "exportedAt"],
        },
        RoboflowPayload: {
          type: "object",
          properties: {
            image: {
              type: "string",
              description: "Imagem em base64, com ou sem prefixo data URI.",
              example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
            },
          },
          required: ["image"],
        },
        RoboflowResponse: {
          type: "object",
          additionalProperties: true,
          properties: {
            predictions: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
              },
            },
            countObjects: { type: "number" },
            outputImage: { type: ["string", "null"] },
          },
        },
      },
    },
    paths: {
        "/api/docs": {
          get: {
            tags: ["Docs"],
            summary: "Retorna a especificacao OpenAPI em JSON.",
            security: adminCookieSecurity,
            responses: {
              "200": {
                description: "Documento OpenAPI gerado com sucesso.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      additionalProperties: true,
                    },
                  },
                },
              },
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
            },
          },
        },
        "/api/auth/login": {
          post: {
            tags: ["Auth"],
            summary: "Realiza login administrativo.",
            description:
              "Rota publica. Em caso de sucesso, define o cookie `labriot_admin_session`.",
            requestBody: jsonRequest("LoginPayload"),
            responses: {
              "200": jsonResponse("Login realizado com sucesso.", "LoginSuccess"),
              "400": validationErrorResponse(),
              "401": errorResponse("Credenciais invalidas.", "Usuario ou senha invalidos."),
              "429": errorResponse(
                "Rate limit de autenticacao excedido.",
                "Muitas tentativas de login. Tente novamente mais tarde."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/auth/logout": {
          post: {
            tags: ["Auth"],
            summary: "Encerra a sessao administrativa atual.",
            security: adminCookieSecurity,
            responses: {
              "200": jsonResponse("Logout concluido.", "LoginSuccess"),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
            },
          },
        },
        "/api/admin/users": {
          get: {
            tags: ["Admins"],
            summary: "Lista administradores e auditoria recente.",
            security: adminCookieSecurity,
            responses: {
              "200": jsonResponse("Lista carregada com sucesso.", "AdminUsersResponse"),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          post: {
            tags: ["Admins"],
            summary: "Cria um novo administrador.",
            security: adminCookieSecurity,
            requestBody: jsonRequest("CreateAdminPayload"),
            responses: {
              "201": jsonResponse("Administrador criado com sucesso.", "AdminUser"),
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "409": errorResponse(
                "Conflito de usuario.",
                "Ja existe um administrador com esse usuario."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/admin/users/{id}": {
          delete: {
            tags: ["Admins"],
            summary: "Exclui um administrador.",
            security: adminCookieSecurity,
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
                description: "ObjectId do administrador.",
              },
            ],
            responses: {
              "204": { description: "Administrador excluido com sucesso." },
              "400": errorResponse("ID invalido.", "ID de administrador invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Administrador nao encontrado.", "Administrador nao encontrado."),
              "409": errorResponse(
                "Operacao bloqueada por regra de negocio.",
                "Voce nao pode excluir o administrador que esta em uso na sessao atual."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/admin/users/me/password": {
          put: {
            tags: ["Admins"],
            summary: "Atualiza a senha do administrador autenticado.",
            security: adminCookieSecurity,
            requestBody: jsonRequest("UpdateAdminPasswordPayload"),
            responses: {
              "200": {
                description: "Senha atualizada com sucesso.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                      },
                      required: ["message"],
                    },
                  },
                },
              },
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Administrador nao encontrado.", "Administrador nao encontrado."),
              "409": errorResponse("Senha atual incorreta.", "Senha atual incorreta."),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/admin/attendance": {
          get: {
            tags: ["Attendance"],
            summary: "Lista reunioes de presenca e membros atuais.",
            security: adminCookieSecurity,
            responses: {
              "200": jsonResponse("Presencas carregadas com sucesso.", "AttendanceListResponse"),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          post: {
            tags: ["Attendance"],
            summary: "Cria uma reuniao de presenca importando os membros atuais.",
            security: adminCookieSecurity,
            requestBody: jsonRequest("AttendanceSessionPayload"),
            responses: {
              "201": jsonResponse("Reuniao criada com sucesso.", "AttendanceSession"),
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "429": errorResponse(
                "Rate limit de presenca excedido.",
                "Muitas alteracoes de presenca. Tente novamente mais tarde."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/admin/attendance/{id}": {
          get: {
            tags: ["Attendance"],
            summary: "Carrega uma reuniao de presenca por ID.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "200": jsonResponse("Reuniao carregada com sucesso.", "AttendanceSession"),
              "400": errorResponse("ID invalido.", "ID de reuniao de presenca invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse(
                "Reuniao nao encontrada.",
                "Reuniao de presenca nao encontrada."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          put: {
            tags: ["Attendance"],
            summary: "Atualiza presenca, atividade e observacoes de uma reuniao.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            requestBody: jsonRequest("AttendanceSessionUpdatePayload"),
            responses: {
              "200": jsonResponse("Presenca atualizada com sucesso.", "AttendanceSession"),
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse(
                "Reuniao nao encontrada.",
                "Reuniao de presenca nao encontrada."
              ),
              "429": errorResponse(
                "Rate limit de presenca excedido.",
                "Muitas alteracoes de presenca. Tente novamente mais tarde."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          delete: {
            tags: ["Attendance"],
            summary: "Remove uma reuniao de presenca e suas marcacoes.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "204": { description: "Reuniao removida com sucesso." },
              "400": errorResponse("ID invalido.", "ID de reuniao de presenca invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse(
                "Reuniao nao encontrada.",
                "Reuniao de presenca nao encontrada."
              ),
              "429": errorResponse(
                "Rate limit de presenca excedido.",
                "Muitas alteracoes de presenca. Tente novamente mais tarde."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/admin/export": {
          get: {
            tags: ["Export"],
            summary: "Exporta dados administrativos em JSON.",
            security: adminCookieSecurity,
            parameters: [
              {
                name: "scope",
                in: "query",
                required: false,
                schema: {
                  type: "string",
                  enum: ["all", "projects", "publications"],
                  default: "all",
                },
                description: "Escopo da exportacao.",
              },
            ],
            responses: {
              "200": jsonResponse("Exportacao gerada com sucesso.", "ExportPayload"),
              "400": errorResponse("Escopo invalido.", "Escopo de exportacao invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/settings": {
          get: {
            tags: ["Settings"],
            summary: "Retorna as configuracoes do site.",
            security: adminCookieSecurity,
            responses: {
              "200": jsonResponse("Configuracoes carregadas com sucesso.", "SiteSettings"),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          put: {
            tags: ["Settings"],
            summary: "Atualiza as configuracoes do site.",
            security: adminCookieSecurity,
            requestBody: jsonRequest("SiteSettingsPayload"),
            responses: {
              "200": jsonResponse("Configuracoes salvas com sucesso.", "SiteSettings"),
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/projects": {
          get: {
            tags: ["Projects"],
            summary: "Lista projetos.",
            security: adminCookieSecurity,
            responses: {
              "200": {
                description: "Projetos carregados com sucesso.",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Project" },
                    },
                  },
                },
              },
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
            },
          },
          post: {
            tags: ["Projects"],
            summary: "Cria um projeto.",
            security: adminCookieSecurity,
            requestBody: jsonRequest("ProjectPayload"),
            responses: {
              "201": jsonResponse("Projeto criado com sucesso.", "Project"),
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/projects/{id}": {
          get: {
            tags: ["Projects"],
            summary: "Busca um projeto por ID.",
            security: adminCookieSecurity,
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            responses: {
              "200": jsonResponse("Projeto encontrado.", "Project"),
              ...commonProtectedResponses("Projeto nao encontrado"),
            },
          },
          put: {
            tags: ["Projects"],
            summary: "Atualiza um projeto.",
            security: adminCookieSecurity,
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            requestBody: jsonRequest("ProjectPayload"),
            responses: {
              "200": jsonResponse("Projeto atualizado com sucesso.", "Project"),
              "400": errorResponse("ID invalido ou payload invalido.", "ID de projeto invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Projeto nao encontrado.", "Projeto nao encontrado"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          delete: {
            tags: ["Projects"],
            summary: "Exclui um projeto.",
            security: adminCookieSecurity,
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string" },
              },
            ],
            responses: {
              "204": { description: "Projeto excluido com sucesso." },
              ...commonProtectedResponses("Projeto nao encontrado"),
            },
          },
        },
        "/api/team": {
          get: {
            tags: ["Team"],
            summary: "Lista membros da equipe.",
            security: adminCookieSecurity,
            responses: {
              "200": {
                description: "Equipe carregada com sucesso.",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TeamMember" },
                    },
                  },
                },
              },
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
            },
          },
          post: {
            tags: ["Team"],
            summary: "Cria um membro da equipe.",
            security: adminCookieSecurity,
            requestBody: jsonRequest("TeamPayload"),
            responses: {
              "201": jsonResponse("Membro criado com sucesso.", "TeamMember"),
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/team/{id}": {
          get: {
            tags: ["Team"],
            summary: "Busca um membro por ID.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "200": jsonResponse("Membro encontrado.", "TeamMember"),
              "400": errorResponse("ID invalido.", "ID de membro invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Membro nao encontrado.", "Membro nao encontrado"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          put: {
            tags: ["Team"],
            summary: "Atualiza um membro da equipe.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            requestBody: jsonRequest("TeamPayload"),
            responses: {
              "200": jsonResponse("Membro atualizado com sucesso.", "TeamMember"),
              "400": errorResponse("ID invalido ou payload invalido.", "ID de membro invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Membro nao encontrado.", "Membro nao encontrado"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          delete: {
            tags: ["Team"],
            summary: "Exclui um membro da equipe.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "204": { description: "Membro excluido com sucesso." },
              "400": errorResponse("ID invalido.", "ID de membro invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Membro nao encontrado.", "Membro nao encontrado"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/publications": {
          get: {
            tags: ["Publications"],
            summary: "Lista publicacoes.",
            security: adminCookieSecurity,
            responses: {
              "200": {
                description: "Publicacoes carregadas com sucesso.",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Publication" },
                    },
                  },
                },
              },
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
            },
          },
          post: {
            tags: ["Publications"],
            summary: "Cria uma publicacao.",
            security: adminCookieSecurity,
            requestBody: jsonRequest("PublicationPayload"),
            responses: {
              "201": jsonResponse("Publicacao criada com sucesso.", "Publication"),
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/publications/{id}": {
          get: {
            tags: ["Publications"],
            summary: "Busca uma publicacao por ID.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "200": jsonResponse("Publicacao encontrada.", "Publication"),
              "400": errorResponse("ID invalido.", "ID de publicacao invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Publicacao nao encontrada.", "Publicacao nao encontrada"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          put: {
            tags: ["Publications"],
            summary: "Atualiza uma publicacao.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            requestBody: jsonRequest("PublicationPayload"),
            responses: {
              "200": jsonResponse("Publicacao atualizada com sucesso.", "Publication"),
              "400": errorResponse(
                "ID invalido ou payload invalido.",
                "ID de publicacao invalido."
              ),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Publicacao nao encontrada.", "Publicacao nao encontrada"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          delete: {
            tags: ["Publications"],
            summary: "Exclui uma publicacao.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "204": { description: "Publicacao excluida com sucesso." },
              "400": errorResponse("ID invalido.", "ID de publicacao invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Publicacao nao encontrada.", "Publicacao nao encontrada"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/posts": {
          get: {
            tags: ["Posts"],
            summary: "Lista posts do blog.",
            security: adminCookieSecurity,
            responses: {
              "200": {
                description: "Posts carregados com sucesso.",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Post" },
                    },
                  },
                },
              },
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
            },
          },
          post: {
            tags: ["Posts"],
            summary: "Cria um post do blog.",
            security: adminCookieSecurity,
            requestBody: jsonRequest("PostPayload"),
            responses: {
              "201": jsonResponse("Post criado com sucesso.", "Post"),
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/posts/{id}": {
          get: {
            tags: ["Posts"],
            summary: "Busca um post por ID.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "200": jsonResponse("Post encontrado.", "Post"),
              "400": errorResponse("ID invalido.", "ID de post invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Post nao encontrado.", "Post nao encontrado"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          put: {
            tags: ["Posts"],
            summary: "Atualiza um post.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            requestBody: jsonRequest("PostPayload"),
            responses: {
              "200": jsonResponse("Post atualizado com sucesso.", "Post"),
              "400": errorResponse("ID invalido ou payload invalido.", "ID de post invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Post nao encontrado.", "Post nao encontrado"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          delete: {
            tags: ["Posts"],
            summary: "Exclui um post.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "204": { description: "Post excluido com sucesso." },
              "400": errorResponse("ID invalido.", "ID de post invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Post nao encontrado.", "Post nao encontrado"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/events": {
          get: {
            tags: ["Events"],
            summary: "Lista eventos.",
            security: adminCookieSecurity,
            responses: {
              "200": {
                description: "Eventos carregados com sucesso.",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Event" },
                    },
                  },
                },
              },
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
            },
          },
          post: {
            tags: ["Events"],
            summary: "Cria um evento.",
            security: adminCookieSecurity,
            requestBody: jsonRequest("EventPayload"),
            responses: {
              "201": jsonResponse("Evento criado com sucesso.", "Event"),
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/events/{id}": {
          get: {
            tags: ["Events"],
            summary: "Busca um evento por ID.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "200": jsonResponse("Evento encontrado.", "Event"),
              "400": errorResponse("ID invalido.", "ID de evento invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Evento nao encontrado.", "Evento nao encontrado"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          put: {
            tags: ["Events"],
            summary: "Atualiza um evento.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            requestBody: jsonRequest("EventPayload"),
            responses: {
              "200": jsonResponse("Evento atualizado com sucesso.", "Event"),
              "400": errorResponse("ID invalido ou payload invalido.", "ID de evento invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Evento nao encontrado.", "Evento nao encontrado"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          delete: {
            tags: ["Events"],
            summary: "Exclui um evento.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "204": { description: "Evento excluido com sucesso." },
              "400": errorResponse("ID invalido.", "ID de evento invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Evento nao encontrado.", "Evento nao encontrado"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/research": {
          get: {
            tags: ["Research"],
            summary: "Lista pesquisas.",
            security: adminCookieSecurity,
            responses: {
              "200": {
                description: "Pesquisas carregadas com sucesso.",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Research" },
                    },
                  },
                },
              },
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
            },
          },
          post: {
            tags: ["Research"],
            summary: "Cria uma pesquisa.",
            security: adminCookieSecurity,
            requestBody: jsonRequest("ResearchPayload"),
            responses: {
              "201": jsonResponse("Pesquisa criada com sucesso.", "Research"),
              "400": validationErrorResponse(),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/research/{id}": {
          get: {
            tags: ["Research"],
            summary: "Busca uma pesquisa por ID.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "200": jsonResponse("Pesquisa encontrada.", "Research"),
              "400": errorResponse("ID invalido.", "ID de pesquisa invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Pesquisa nao encontrada.", "Pesquisa nao encontrada"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          put: {
            tags: ["Research"],
            summary: "Atualiza uma pesquisa.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            requestBody: jsonRequest("ResearchPayload"),
            responses: {
              "200": jsonResponse("Pesquisa atualizada com sucesso.", "Research"),
              "400": errorResponse("ID invalido ou payload invalido.", "ID de pesquisa invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Pesquisa nao encontrada.", "Pesquisa nao encontrada"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
          delete: {
            tags: ["Research"],
            summary: "Exclui uma pesquisa.",
            security: adminCookieSecurity,
            parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
            responses: {
              "204": { description: "Pesquisa excluida com sucesso." },
              "400": errorResponse("ID invalido.", "ID de pesquisa invalido."),
              "401": errorResponse(
                "Sessao administrativa ausente ou invalida.",
                "Autenticacao de administrador obrigatoria."
              ),
              "404": errorResponse("Pesquisa nao encontrada.", "Pesquisa nao encontrada"),
              "503": errorResponse(
                "Banco indisponivel ou nao configurado.",
                "MongoDB nao configurado. Defina DATABASE_URL no .env."
              ),
            },
          },
        },
        "/api/roboflow": {
          post: {
            tags: ["Integracoes Externas"],
            summary: "Encaminha uma imagem base64 para o workflow do Roboflow.",
            description:
              "Rota publica usada pela tela do projeto Roboflow. Esta integracao pertence a um servico externo e foi separada da area principal da documentacao.",
            requestBody: jsonRequest("RoboflowPayload"),
            responses: {
              "200": jsonResponse("Inferencia executada com sucesso.", "RoboflowResponse"),
              "400": {
                description: "Imagem ausente.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: { type: "string" },
                      },
                      required: ["error"],
                    },
                  },
                },
              },
              "500": {
                description: "Falha interna ou erro vindo do Roboflow.",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: { type: "string" },
                      },
                      required: ["error"],
                    },
                  },
                },
              },
            },
          },
        },
    },
  };
}
