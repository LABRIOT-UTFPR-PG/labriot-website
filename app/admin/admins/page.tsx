"use client"

import { useEffect, useState } from "react"
import { KeyRound, Shield, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { getApiErrorMessage } from "@/lib/form-errors"

type AdminUser = {
  id: string
  username: string
  createdAt: string
}

type AuditLog = {
  id: string
  adminUsername: string
  action: string
  resourceType: string
  summary: string
  ip: string | null
  createdAt: string
}

function getActionLabel(action: string) {
  if (action === "login") return "Login"
  if (action === "logout") return "Logout"
  if (action === "create") return "Criacao"
  if (action === "update") return "Atualizacao"
  if (action === "delete") return "Exclusao"
  return action
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    void loadAdmins()
  }, [])

  async function loadAdmins() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/users")
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nao foi possivel carregar os administradores."))
      }

      setAdmins(Array.isArray(payload?.users) ? payload.users : [])
      setAuditLogs(Array.isArray(payload?.auditLogs) ? payload.auditLogs : [])
      setCurrentUserId(typeof payload?.currentUserId === "string" ? payload.currentUserId : null)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Nao foi possivel carregar os administradores.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(admin: AdminUser) {
    if (!window.confirm(`Tem certeza que deseja excluir o administrador ${admin.username}?`)) {
      return
    }

    setError("")
    setDeletingId(admin.id)

    try {
      const response = await fetch(`/api/admin/users/${admin.id}`, {
        method: "DELETE",
      })

      const payload = response.status === 204 ? null : await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nao foi possivel excluir o administrador."))
      }

      await loadAdmins()
      toast({
        title: "Administrador excluido",
        description: `O usuario ${admin.username} foi removido.`,
      })
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir o administrador.")
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas nao coincidem.")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nao foi possivel criar o administrador."))
      }

      await loadAdmins()
      setUsername("")
      setPassword("")
      setConfirmPassword("")

      toast({
        title: "Administrador criado",
        description: `O usuario ${payload.username} ja pode acessar o painel.`,
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel criar o administrador.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")

    if (newPassword !== confirmNewPassword) {
      setError("As novas senhas nao coincidem.")
      return
    }

    setChangingPassword(true)

    try {
      const response = await fetch("/api/admin/users/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword: confirmNewPassword,
        }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nao foi possivel atualizar a senha."))
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
      await loadAdmins()
      toast({
        title: "Senha atualizada",
        description: "Sua senha administrativa foi alterada com sucesso.",
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel atualizar a senha.")
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administradores</h1>
          <p className="text-sm text-muted-foreground">
            Apenas um administrador autenticado pode cadastrar novos administradores.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Acessos Ativos
            </CardTitle>
            <CardDescription>Lista de usuarios com permissao de administracao.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Carregando administradores...</p>
            ) : error && admins.length === 0 ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : admins.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum administrador encontrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">
                        {admin.username}
                        {admin.id === currentUserId ? (
                          <span className="ml-2 text-xs text-muted-foreground">(voce)</span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {new Date(admin.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          disabled={
                            deletingId === admin.id ||
                            admins.length <= 1 ||
                            admin.id === currentUserId
                          }
                          onClick={() => void handleDelete(admin)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deletingId === admin.id ? "Excluindo..." : "Excluir"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Novo Administrador
              </CardTitle>
              <CardDescription>Crie um novo acesso para a equipe que vai operar o painel.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="ex: labriot-admin"
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimo de 8 caracteres"
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repita a senha"
                    disabled={submitting}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Criando..." : "Criar administrador"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Minha Senha
              </CardTitle>
              <CardDescription>Atualize a senha do administrador atualmente logado.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="Digite sua senha atual"
                    disabled={changingPassword}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Minimo de 8 caracteres"
                    disabled={changingPassword}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(event) => setConfirmNewPassword(event.target.value)}
                    placeholder="Repita a nova senha"
                    disabled={changingPassword}
                    required
                  />
                </div>

                {error ? <p className="text-sm text-destructive whitespace-pre-line">{error}</p> : null}

                <Button type="submit" disabled={changingPassword} className="w-full">
                  {changingPassword ? "Atualizando..." : "Atualizar senha"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auditoria Recente</CardTitle>
          <CardDescription>
            Historico das acoes administrativas registradas no painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando auditoria...</p>
          ) : auditLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum evento de auditoria registrado ainda.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Acao</TableHead>
                  <TableHead>Resumo</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead className="text-right">Quando</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.adminUsername}</TableCell>
                    <TableCell>{getActionLabel(log.action)}</TableCell>
                    <TableCell>{log.summary}</TableCell>
                    <TableCell>{log.ip || "-"}</TableCell>
                    <TableCell className="text-right">
                      {new Date(log.createdAt).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
