"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DatePicker, FormErrors, SaveButton } from "@/components/common"
import { useDashboard } from "@/components/DashboardProvider"
import {
  CATEGORIES,
  PRIORITIES,
  PROJECT_STATUSES,
  type Priority,
  type Project,
  type ProjectStatus,
  initials,
} from "@/lib/dashboard-data"

const emptyForm = {
  name: "",
  description: "",
  category: "",
  priority: "",
  status: "Planificado",
  endDate: "",
}

export function ProjectForm({ project, trigger }: { project?: Project; trigger?: React.ReactNode }) {
  const { projects, members, saveProject } = useDashboard()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [formData, setFormData] = useState(emptyForm)
  const [memberIds, setMemberIds] = useState<string[]>([])

  // Al abrir se cargan los datos del proyecto (editar) o el formulario vacío (crear)
  const handleOpenChange = (value: boolean) => {
    if (value) {
      setFormData(project ? { ...project } : emptyForm)
      setMemberIds(project ? members.filter((m) => m.projectId === project.id).map((m) => m.userId) : [])
      setErrors([])
    }
    setOpen(value)
  }

  const toggleMember = (userId: string, checked: boolean) => {
    setMemberIds((prev) => (checked ? [...prev, userId] : prev.filter((id) => id !== userId)))
  }

  const validate = () => {
    const list: string[] = []
    if (formData.name.trim().length < 3) list.push("El nombre debe tener al menos 3 caracteres.")
    if (projects.some((p) => p.name.toLowerCase() === formData.name.trim().toLowerCase() && p.id !== project?.id))
      list.push("Ya existe un proyecto con ese nombre.")
    if (!formData.category) list.push("Selecciona una categoría.")
    if (!formData.priority) list.push("Selecciona la prioridad.")
    if (!formData.endDate) list.push("Selecciona la fecha de entrega.")
    if (memberIds.length === 0) list.push("Asigna al menos un miembro del equipo.")
    return list
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const list = validate()
    setErrors(list)
    if (list.length > 0) return

    setSaving(true)
    await saveProject(
      {
        id: project?.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority as Priority,
        status: formData.status as ProjectStatus,
        endDate: formData.endDate,
      },
      memberIds
    )
    setSaving(false)

    // Limpiar y cerrar
    setFormData(emptyForm)
    setOpen(false)
  }

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "Sin proyecto"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Nuevo Proyecto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{project ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormErrors errors={errors} />

            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>
                  Prioridad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
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
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">
                  Fecha de entrega <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  id="endDate"
                  value={formData.endDate}
                  onChange={(value) => setFormData({ ...formData, endDate: value })}
                />
              </div>
            </div>

            {/* Campo nuevo: miembros del equipo */}
            <div className="grid gap-2">
              <Label>
                Miembros del equipo <span className="text-red-500">*</span>
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  {memberIds.length} seleccionados
                </span>
              </Label>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border p-2">
                {members.map((m) => (
                  <label
                    key={m.userId}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"
                  >
                    <Checkbox
                      checked={memberIds.includes(m.userId)}
                      onCheckedChange={(checked) => toggleMember(m.userId, checked === true)}
                    />
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">{initials(m.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-sm">
                      <p className="font-medium leading-none">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.position}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {m.projectId === project?.id ? "" : projectName(m.projectId)}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Cada miembro pertenece a un proyecto; si eliges uno de otro proyecto, se reasigna a este.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <SaveButton saving={saving}>{project ? "Guardar Cambios" : "Crear Proyecto"}</SaveButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
