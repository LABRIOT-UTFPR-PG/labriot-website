"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, CalendarDays, CheckCheck, ClipboardCheck, Plus, Save, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { getApiErrorMessage } from "@/lib/form-errors"
import { cn } from "@/lib/utils"

type TeamMember = {
  id: string
  name: string
  role: string
  specialization: string | null
  category: string
}

type AttendanceRecord = {
  id: string
  sessionId: string
  memberId: string
  memberName: string
  memberRole: string | null
  present: boolean
  active: boolean
  notes: string | null
}

type AttendanceSession = {
  id: string
  title: string
  date: string
  summary: string | null
  createdAt: string
  updatedAt: string
  records: AttendanceRecord[]
  totalMembers: number
  presentCount: number
  activeCount: number
}

type AttendanceDraft = {
  title: string
  date: string
  summary: string
  records: Array<AttendanceRecord & { notes: string }>
}

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-")

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}

function getDefaultMeetingTitle(date: string) {
  return `Reunião ${formatDate(date)}`
}

function toDraft(session: AttendanceSession): AttendanceDraft {
  return {
    title: session.title,
    date: session.date,
    summary: session.summary ?? "",
    records: session.records.map((record) => ({
      ...record,
      notes: record.notes ?? "",
    })),
  }
}

function sortSessions(sessions: AttendanceSession[]) {
  return sessions.slice().sort((left, right) => {
    const dateComparison = right.date.localeCompare(left.date)

    if (dateComparison !== 0) {
      return dateComparison
    }

    return right.createdAt.localeCompare(left.createdAt)
  })
}

export default function AttendanceAdminPage() {
  const today = useMemo(() => getTodayInputValue(), [])
  const [sessions, setSessions] = useState<AttendanceSession[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<AttendanceDraft | null>(null)
  const [newTitle, setNewTitle] = useState(() => getDefaultMeetingTitle(getTodayInputValue()))
  const [newDate, setNewDate] = useState(today)
  const [newSummary, setNewSummary] = useState("")
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const selectedSession = sessions.find((session) => session.id === selectedId) ?? null
  const presentCount = draft?.records.filter((record) => record.present).length ?? 0
  const activeCount = draft?.records.filter((record) => record.active).length ?? 0

  useEffect(() => {
    void loadAttendance()
  }, [])

  useEffect(() => {
    if (!selectedSession) {
      setDraft(null)
      return
    }

    setDraft(toDraft(selectedSession))
  }, [selectedSession?.id])

  async function loadAttendance() {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/attendance", {
        cache: "no-store",
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nao foi possivel carregar as presencas."))
      }

      const loadedSessions = Array.isArray(payload?.sessions) ? sortSessions(payload.sessions) : []
      setSessions(loadedSessions)
      setTeam(Array.isArray(payload?.team) ? payload.team : [])

      setSelectedId((currentSelectedId) => {
        if (currentSelectedId && loadedSessions.some((session) => session.id === currentSelectedId)) {
          return currentSelectedId
        }

        return loadedSessions[0]?.id ?? null
      })
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Nao foi possivel carregar as presencas.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateSession(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setCreating(true)

    try {
      const response = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          date: newDate,
          summary: newSummary,
        }),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nao foi possivel criar a reuniao de presenca."))
      }

      setSessions((currentSessions) => sortSessions([payload, ...currentSessions]))
      setSelectedId(payload.id)
      setDraft(toDraft(payload))
      setNewSummary("")
      setNewTitle(getDefaultMeetingTitle(newDate))

      toast({
        title: "Reuniao criada",
        description: `${payload.totalMembers ?? 0} membros foram importados para a chamada.`,
      })
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Nao foi possivel criar a reuniao.")
    } finally {
      setCreating(false)
    }
  }

  async function handleSaveSession() {
    if (!selectedId || !draft) {
      return
    }

    setError("")
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/attendance/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          date: draft.date,
          summary: draft.summary,
          records: draft.records.map((record) => ({
            memberId: record.memberId,
            present: record.present,
            active: record.active,
            notes: record.notes,
          })),
        }),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nao foi possivel salvar a presenca."))
      }

      setSessions((currentSessions) =>
        sortSessions(currentSessions.map((session) => (session.id === payload.id ? payload : session)))
      )
      setDraft(toDraft(payload))

      toast({
        title: "Presenca salva",
        description: `${payload.presentCount}/${payload.totalMembers} membros marcados como presentes.`,
      })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Nao foi possivel salvar a presenca.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteSession() {
    if (!selectedSession) {
      return
    }

    if (!window.confirm(`Tem certeza que deseja excluir a reuniao "${selectedSession.title}"?`)) {
      return
    }

    setError("")
    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/attendance/${selectedSession.id}`, {
        method: "DELETE",
      })
      const payload = response.status === 204 ? null : await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, "Nao foi possivel excluir a reuniao."))
      }

      setSessions((currentSessions) => {
        const nextSessions = currentSessions.filter((session) => session.id !== selectedSession.id)
        setSelectedId(nextSessions[0]?.id ?? null)
        return nextSessions
      })

      toast({
        title: "Reuniao excluida",
        description: "O registro de presenca foi removido.",
      })
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Nao foi possivel excluir a reuniao.")
    } finally {
      setDeleting(false)
    }
  }

  function updateRecord(memberId: string, updates: Partial<Pick<AttendanceRecord, "present" | "active">> & { notes?: string }) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft
      }

      return {
        ...currentDraft,
        records: currentDraft.records.map((record) =>
          record.memberId === memberId
            ? {
                ...record,
                ...updates,
              }
            : record
        ),
      }
    })
  }

  function markAllPresent(present: boolean) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft
      }

      return {
        ...currentDraft,
        records: currentDraft.records.map((record) => ({
          ...record,
          present,
        })),
      }
    })
  }

  function markAllActive(active: boolean) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft
      }

      return {
        ...currentDraft,
        records: currentDraft.records.map((record) => ({
          ...record,
          active,
        })),
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Presença dos Membros</h1>
          <p className="text-sm text-muted-foreground">
            Crie chamadas de reuniao, importe os membros cadastrados e registre presenca, atividade e observacoes.
          </p>
        </div>
        <Badge variant="outline" className="w-fit gap-2">
          <Users className="h-4 w-4" />
          {team.length} membros cadastrados
        </Badge>
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova reuniao
              </CardTitle>
              <CardDescription>
                Ao criar, os membros atuais da equipe sao importados automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="attendance-title">Titulo</Label>
                  <Input
                    id="attendance-title"
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                    disabled={creating}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attendance-date">Data</Label>
                  <Input
                    id="attendance-date"
                    type="date"
                    value={newDate}
                    onChange={(event) => {
                      setNewDate(event.target.value)
                      setNewTitle((currentTitle) =>
                        currentTitle.trim() ? currentTitle : getDefaultMeetingTitle(event.target.value)
                      )
                    }}
                    disabled={creating}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attendance-summary">Resumo da reuniao</Label>
                  <Textarea
                    id="attendance-summary"
                    value={newSummary}
                    onChange={(event) => setNewSummary(event.target.value)}
                    placeholder="Ex.: Reuniao semanal de alinhamento dos projetos."
                    disabled={creating}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={creating || team.length === 0}>
                  <ClipboardCheck className="h-4 w-4" />
                  {creating ? "Criando..." : "Criar e importar membros"}
                </Button>
                {team.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Cadastre membros da equipe antes de criar uma chamada.
                  </p>
                ) : null}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historico de reunioes</CardTitle>
              <CardDescription>Selecione uma reuniao para editar a chamada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Carregando chamadas...</p>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma reuniao de presenca criada ainda.</p>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => setSelectedId(session.id)}
                    className={cn(
                      "w-full rounded-xl border p-4 text-left transition-colors hover:bg-accent/60",
                      selectedId === session.id ? "border-primary bg-accent" : "border-border bg-background"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(session.date)}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {session.presentCount}/{session.totalMembers}
                      </Badge>
                    </div>
                    {session.summary ? (
                      <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{session.summary}</p>
                    ) : null}
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            {selectedSession && draft ? (
              <div className="space-y-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5" />
                      Chamada da reuniao
                    </CardTitle>
                    <CardDescription>
                      Marque quem participou e registre sinais de atividade ou contexto importante.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <CheckCheck className="h-3.5 w-3.5" />
                      {presentCount}/{draft.records.length} presentes
                    </Badge>
                    <Badge variant="outline">{activeCount} ativos</Badge>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.2fr_180px]">
                  <div className="space-y-2">
                    <Label htmlFor="selected-title">Titulo</Label>
                    <Input
                      id="selected-title"
                      value={draft.title}
                      onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selected-date">Data</Label>
                    <Input
                      id="selected-date"
                      type="date"
                      value={draft.date}
                      onChange={(event) => setDraft({ ...draft, date: event.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selected-summary">Resumo da reuniao</Label>
                  <Textarea
                    id="selected-summary"
                    value={draft.summary}
                    onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
                    placeholder="Ex.: Pontos discutidos, proximos passos e combinados gerais."
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => markAllPresent(true)}>
                    Marcar todos presentes
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => markAllPresent(false)}>
                    Limpar presencas
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => markAllActive(true)}>
                    Marcar todos ativos
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => markAllActive(false)}>
                    Marcar todos inativos
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <CardTitle>Chamada da reuniao</CardTitle>
                <CardDescription>Crie ou selecione uma reuniao para editar a presenca.</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {!selectedSession || !draft ? (
              <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                Nenhuma reuniao selecionada.
              </div>
            ) : draft.records.length === 0 ? (
              <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                Esta reuniao ainda nao possui membros importados.
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Membro</TableHead>
                      <TableHead className="w-[140px]">Participou</TableHead>
                      <TableHead className="w-[120px]">Ativo</TableHead>
                      <TableHead>Observacoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draft.records.map((record) => (
                      <TableRow key={record.memberId}>
                        <TableCell>
                          <div className="font-medium">{record.memberName}</div>
                          {record.memberRole ? (
                            <div className="text-xs text-muted-foreground">{record.memberRole}</div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={record.present}
                              onCheckedChange={(checked) =>
                                updateRecord(record.memberId, { present: checked === true })
                              }
                              aria-label={`Marcar presenca de ${record.memberName}`}
                            />
                            <span className="text-xs text-muted-foreground">
                              {record.present ? "Sim" : "Nao"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={record.active}
                              onCheckedChange={(checked) =>
                                updateRecord(record.memberId, { active: checked === true })
                              }
                              aria-label={`Marcar atividade de ${record.memberName}`}
                            />
                            <span className="text-xs text-muted-foreground">
                              {record.active ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={record.notes}
                            onChange={(event) => updateRecord(record.memberId, { notes: event.target.value })}
                            placeholder="Ex.: membro esta ativo e fazendo tasks do projeto."
                            className="min-h-[72px]"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={handleDeleteSession}
                    disabled={deleting || saving}
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleting ? "Excluindo..." : "Excluir reuniao"}
                  </Button>
                  <Button type="button" onClick={handleSaveSession} disabled={saving || deleting}>
                    <Save className="h-4 w-4" />
                    {saving ? "Salvando..." : "Salvar presenca"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
