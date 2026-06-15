import { SwaggerView } from "@/components/admin/swagger-view";

export default function AdminSwaggerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Swagger</h1>
        <p className="text-muted-foreground">
          Documentacao interativa das rotas da aplicacao em formato OpenAPI.
        </p>
      </div>

      <SwaggerView />
    </div>
  );
}
