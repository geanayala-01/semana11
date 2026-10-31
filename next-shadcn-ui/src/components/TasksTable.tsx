"use client"

import { useState } from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ConfirmDelete, DatePicker, FormErrors, LoadingState, SaveButton, formatDate } from "@/components/common"
import { useDashboard } from "@/components/DashboardProvider"
import { priorityVariant, statusVariant } from "@/components/ProjectsTab"
import { PRIORITIES, TASK_STATUSES, type Priority, type Task, type TaskStatus } from "@/lib/dashboard-data"

const emptyTask = { description: "", projectId: "", status: "Pendiente", priority: "", userId: "", deadline: "" }

function TaskForm({ task, trigger }: { task?: Task; trigger: React.ReactNode }) {
  const { projects, members, saveTask } = useDashboard()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [form, setForm] = useState(emptyTask)

  const handleOpenChange = (value: boolean) => {
    if (value) {
      setForm(task ? { ...task } : emptyTask)
      setErrors([])
    }
    setOpen(value)
  }

  // Solo se puede asignar a miembros activos del proyecto elegido
  const projectMembers = members.filter((m) => m.projectId === form.projectId && (m.isActive || m.userId === form.userId))

  const validate = () => {
    const list: string[] = []
    if (form.description.trim().length < 5) list.push("La descripción debe tener al menos 5 caracteres.")
    if (!form.projectId) list.push("Selecciona un proyecto.")
    if (!form.userId) list.push("Asigna la tarea a un miembro.")
    if (!form.priority) list.push("Selecciona la prioridad.")
    if (!form.deadline) list.push("Selecciona la fecha límite.")
    return list
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const list = validate()
    setErrors(list)
    if (list.length > 0) return
    setSaving(true)
    await saveTask({
      id: task?.id,
      description: form.description.trim(),
      projectId: form.projectId,
      status: form.status as TaskStatus,
      priority: form.priority as Priority,
      userId: form.userId,
      deadline: form.deadline,
    })
    setSaving(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
            <DialogDescription>Define la tarea, su responsable y la fecha límite.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormErrors errors={errors} />
            <div className="grid gap-2">
              <Label htmlFor="taskDescription">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="taskDescription"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="¿Qué hay que hacer?"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>
                  Proyecto <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.projectId}
                  onValueChange={(v) => setForm({ ...form, projectId: v, userId: "" })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>
                  Asignado a <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.userId}
                  onValueChange={(v) => setForm({ ...form, userId: v })}
                  disabled={!form.projectId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={form.projectId ? "Selecciona un miembro" : "Primero elige proyecto"} />
                  </SelectTrigger>
                  <SelectContent>
                    {projectMembers.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground">El proyecto no tiene miembros activos</div>
                    )}
                    {projectMembers.map((m) => (
                      <SelectItem key={m.userId} value={m.userId}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>
                  Prioridad <span className="text-red-500">*</span>
                </Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona la prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="deadline">
                  Fecha límite <span className="text-red-500">*</span>
                </Label>
                <DatePicker id="deadline" value={form.deadline} onChange={(v) => setForm({ ...form, deadline: v })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <SaveButton saving={saving}>{task ? "Guardar Cambios" : "Crear Tarea"}</SaveButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const ALL = "all"

export function TasksTable() {
  const { loading, tasks, projects, members, settings, deleteTask, setTaskStatus } = useDashboard()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState(ALL)

  if (loading) return <LoadingState text="Cargando tareas..." />

  const filtered = statusFilter === ALL ? tasks : tasks.filter((t) => t.status === statusFilter)
  const pageSize = settings.itemsPerPage
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const allDone = visible.length > 0 && visible.every((t) => t.status === "Completado")

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "—"
  const memberName = (id: string) => members.find((m) => m.userId === id)?.name ?? "Sin asignar"

  const goTo = (e: React.MouseEvent, value: number) => {
    e.preventDefault()
    if (value >= 1 && value <= totalPages) setPage(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos los estados</SelectItem>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TaskForm
          trigger={
            <Button>
              <PlusIcon /> Nueva Tarea
            </Button>
          }
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Mostrando {visible.length} de {filtered.length} tareas · página {currentPage} de {totalPages}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allDone}
                  onCheckedChange={(checked) =>
                    setTaskStatus(visible.map((t) => t.id), checked === true ? "Completado" : "Pendiente")
                  }
                  aria-label="Marcar página como completada"
                />
              </TableHead>
              <TableHead>Tarea</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                  No hay tareas para mostrar.
                </TableCell>
              </TableRow>
            )}
            {visible.map((task) => (
              <TableRow key={task.id} data-state={task.status === "Completado" ? "selected" : undefined}>
                <TableCell>
                  <Checkbox
                    checked={task.status === "Completado"}
                    onCheckedChange={(checked) => setTaskStatus([task.id], checked === true ? "Completado" : "Pendiente")}
                    aria-label="Marcar como completada"
                  />
                </TableCell>
                <TableCell className={`font-medium ${task.status === "Completado" ? "text-muted-foreground line-through" : ""}`}>
                  {task.description}
                </TableCell>
                <TableCell>{projectName(task.projectId)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                </TableCell>
                <TableCell>{memberName(task.userId)}</TableCell>
                <TableCell>{formatDate(task.deadline)}</TableCell>
                <TableCell className="text-right">
                  <TaskForm
                    task={task}
                    trigger={
                      <Button variant="ghost" size="sm" aria-label="Editar tarea">
                        <PencilIcon />
                      </Button>
                    }
                  />
                  <ConfirmDelete
                    title="¿Eliminar esta tarea?"
                    description={`"${task.description}" se eliminará permanentemente.`}
                    onConfirm={() => deleteTask(task.id)}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" aria-label="Eliminar tarea">
                        <Trash2Icon />
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Anterior"
              onClick={(e) => goTo(e, currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <PaginationItem key={n}>
              <PaginationLink href="#" isActive={n === currentPage} onClick={(e) => goTo(e, n)}>
                {n}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              text="Siguiente"
              onClick={(e) => goTo(e, currentPage + 1)}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
