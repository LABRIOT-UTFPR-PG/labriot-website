"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FileJson, ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "options", "head"] as const;

type HttpMethod = (typeof HTTP_METHODS)[number];

type OpenApiDocument = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, Partial<Record<HttpMethod, OpenApiOperation>>>;
};

type OpenApiOperation = {
  tags?: string[];
  summary?: string;
  description?: string;
  security?: Array<Record<string, unknown>>;
  requestBody?: unknown;
  responses?: Record<string, OpenApiResponse>;
};

type OpenApiResponse = {
  description?: string;
  content?: Record<string, { schema?: unknown }>;
};

type OperationItem = {
  id: string;
  path: string;
  method: HttpMethod;
  operation: OpenApiOperation;
};

const methodStyles: Record<HttpMethod, string> = {
  get: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300",
  post: "border-blue-500/35 bg-blue-500/10 text-blue-300",
  put: "border-amber-500/35 bg-amber-500/10 text-amber-300",
  patch: "border-purple-500/35 bg-purple-500/10 text-purple-300",
  delete: "border-red-500/35 bg-red-500/10 text-red-300",
  options: "border-slate-500/35 bg-slate-500/10 text-slate-300",
  head: "border-slate-500/35 bg-slate-500/10 text-slate-300",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function getSchemaFromContent(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  const content = value.content;

  if (!isRecord(content)) {
    return null;
  }

  const jsonContent = content["application/json"];

  if (!isRecord(jsonContent)) {
    return null;
  }

  return jsonContent.schema ?? null;
}

function getSchemaName(schema: unknown) {
  if (!isRecord(schema)) {
    return null;
  }

  const ref = schema.$ref;

  if (typeof ref === "string") {
    return ref.split("/").at(-1) ?? ref;
  }

  const type = schema.type;

  if (typeof type === "string") {
    return type;
  }

  if (Array.isArray(type)) {
    return type.join(" | ");
  }

  return null;
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-80 overflow-auto rounded-xl border border-border/70 bg-background/70 p-4 text-xs leading-6 text-muted-foreground">
      <code>{formatJson(value)}</code>
    </pre>
  );
}

function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-16 justify-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
        methodStyles[method]
      )}
    >
      {method}
    </span>
  );
}

function OperationDetails({ item }: { item: OperationItem }) {
  const { operation } = item;
  const requestSchema = getSchemaFromContent(operation.requestBody);
  const requestSchemaName = getSchemaName(requestSchema);
  const responses = Object.entries(operation.responses ?? {});

  return (
    <div className="space-y-5">
      {operation.description ? (
        <p className="text-sm leading-6 text-muted-foreground">{operation.description}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {(operation.tags ?? []).map((tag) => (
          <Badge key={tag} variant="outline" className="border-border/70 text-muted-foreground">
            {tag}
          </Badge>
        ))}
        {operation.security?.length ? (
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-300">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
            Admin cookie
          </Badge>
        ) : (
          <Badge variant="outline" className="border-blue-500/30 text-blue-300">
            Publica
          </Badge>
        )}
      </div>

      {requestSchema ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Request body</h3>
          {requestSchemaName ? (
            <p className="text-xs text-muted-foreground">Schema: {requestSchemaName}</p>
          ) : null}
          <JsonBlock value={requestSchema} />
        </div>
      ) : null}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Responses</h3>
        <div className="grid gap-3">
          {responses.map(([statusCode, response]) => {
            const schema = getSchemaFromContent(response);
            const schemaName = getSchemaName(schema);

            return (
              <div key={statusCode} className="rounded-xl border border-border/70 bg-background/45 p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-mono",
                      statusCode.startsWith("2")
                        ? "border-emerald-500/30 text-emerald-300"
                        : statusCode.startsWith("4")
                          ? "border-amber-500/30 text-amber-300"
                          : "border-red-500/30 text-red-300"
                    )}
                  >
                    {statusCode}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {response.description ?? "Sem descricao."}
                  </span>
                </div>
                {schema ? (
                  <div className="space-y-2">
                    {schemaName ? (
                      <p className="text-xs text-muted-foreground">Schema: {schemaName}</p>
                    ) : null}
                    <JsonBlock value={schema} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getOperations(document: OpenApiDocument): OperationItem[] {
  return Object.entries(document.paths).flatMap(([path, pathItem]) =>
    HTTP_METHODS.flatMap((method) => {
      const operation = pathItem[method];

      if (!operation) {
        return [];
      }

      return [
        {
          id: `${method}:${path}`,
          path,
          method,
          operation,
        },
      ];
    })
  );
}

export function SwaggerView() {
  const [document, setDocument] = useState<OpenApiDocument | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOpenApiDocument() {
      try {
        const response = await fetch("/api/docs", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!response.ok) {
          throw new Error(`Falha ao carregar /api/docs (${response.status})`);
        }

        const payload = (await response.json()) as OpenApiDocument;

        if (cancelled) {
          return;
        }

        setDocument(payload);
        setStatus("ready");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Falha ao carregar OpenAPI.");
      }
    }

    void loadOpenApiDocument();

    return () => {
      cancelled = true;
    };
  }, []);

  const operations = useMemo(() => (document ? getOperations(document) : []), [document]);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        Use o cookie de sessao do painel para testar as rotas protegidas. As rotas `POST /api/auth/login`
        e `POST /api/roboflow` sao publicas; as demais exigem autenticacao de administrador.
      </div>

      {status === "loading" ? (
        <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          Carregando documentacao OpenAPI...
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          Nao foi possivel carregar a documentacao.
          <br />
          {errorMessage}
        </div>
      ) : null}

      {document && status === "ready" ? (
        <div className="space-y-5">
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">OpenAPI {document.openapi}</Badge>
                  <Badge variant="secondary">v{document.info.version}</Badge>
                </div>
                <h2 className="text-xl font-semibold">{document.info.title}</h2>
                {document.info.description ? (
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    {document.info.description}
                  </p>
                ) : null}
              </div>
              <Button asChild variant="outline" size="sm">
                <a href="/api/docs" target="_blank" rel="noreferrer">
                  <FileJson className="h-4 w-4" />
                  Abrir JSON
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <Accordion type="multiple" className="rounded-2xl border bg-card px-4">
            {operations.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-border/70">
                <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
                    <MethodBadge method={item.method} />
                    <code className="rounded-md bg-background/80 px-2 py-1 text-sm text-foreground">
                      {item.path}
                    </code>
                    <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                      {item.operation.summary ?? "Sem resumo."}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <OperationDetails item={item} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : null}
    </div>
  );
}
