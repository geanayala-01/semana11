"use client"

import { useState } from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmDelete, DatePicker, FormErrors, LoadingState, SaveButton, formatDate, isEmail } from "@/components/common"
import { useDashboard } from "@/components/DashboardProvider"
import { ROLES, type Member, type Role, initials } from "@/lib/dashboard-data"

const NO_PROJECT = "none"

function MemberForm({ member, trigger }: { member?: Member; trigger: React.ReactNode }) {
  const { members, projects, saveMember, nextUserId } = useDashboard()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [form, setForm] = useState<Member | null>(null)

  const handleOpenChange = (value: boolean) => {
    if (value) {
      setForm(
        member ?? {
          userId: nextUserId(),
          role: "Miembro",
          name: "",
          email: "",
          position: "",
          birthdate: "",
          phone: "",
          projectId: "",
          isActive: true,
        }
      )
      setErrors([])
    }
    setOpen(value)
  }

  const set = <K extends keyof Member>(key: K, value: Member[K]) => setForm((f) => (f ? { ...f, [key]: value } : f))

  const validate = (f: Member) => {
    const list: string[] = []
    if (f.name.trim().length < 3) list.push("Ingresa el nombre completo.")
    if (!isEmail(f.email)) list.push("Ingresa un email válido.")
    else if (members.some((m) => m.email.toLowerCase() === f.email.toLowerCase() && m.userId !== f.userId))
      list.push("Ese email ya está registrado.")
    if (!f.position.trim()) list.push("Ingresa el cargo.")
    if (!/^9\d{8}$/.test(f.phone)) list.push("El teléfono debe tener 9 dígitos y empezar con 9.")
    if (!f.birthdate) list.push("Selecciona la fecha de nacimiento.")
    return list
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    const list = validate(form)
    setErrors(list)
    if (list.length > 0) return
    setSaving(true)
    await saveMember({ ...form, name: form.name.trim(), position: form.position.trim() }, !member)
    setSaving(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        {form && (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{member ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
              <DialogDescription>Datos del integrante del equipo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormErrors errors={errors} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input id="userId" value={form.userId} disabled />
                </div>
                <div className="grid gap-2">
                  <Label>Rol</Label>
                  <Select value={form.role} onValueChange={(v) => set("role", v as Role)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="memberName">
                    Nombre completo <span className="text-red-500">*</span>
                  </Label>
                  <Input id="memberName" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej. Rosa Quispe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input id="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="correo@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">
                    Teléfono <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    inputMode="numeric"
                    maxLength={9}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                    placeholder="987654321"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">
                    Cargo <span className="text-red-500">*</span>
                  </Label>
                  <Input id="position" value={form.position} onChange={(e) => set("position", e.target.value)} placeholder="Frontend Developer" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthdate">
                    Fecha de nacimiento <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker id="birthdate" birthdate value={form.birthdate} onChange={(v) => set("birthdate", v)} />
                </div>
                <div className="grid gap-2">
                  <Label>Proyecto</Label>
                  <Select
                    value={form.projectId || NO_PROJECT}
                    onValueChange={(v) => set("projectId", v === NO_PROJECT ? "" : v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_PROJECT}>Sin proyecto</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="isActive">Miembro activo</Label>
                  <Switch id="isActive" checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <SaveButton saving={saving}>{member ? "Guardar Cambios" : "Agregar Miembro"}</SaveButton>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function TeamTab() {
  const { loading, members, projects, deleteMember } = useDashboard()
  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? "Sin proyecto"

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
        </div>
        <MemberForm
          trigger={
            <Button>
              <PlusIcon /> Nuevo Miembro
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState text="Cargando equipo..." />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="hidden xl:table-cell">Teléfono</TableHead>
                  <TableHead className="hidden xl:table-cell">Nacimiento</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      No hay miembros registrados.
                    </TableCell>
                  </TableRow>
                )}
                {members.map((member) => (
                  <TableRow key={member.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{initials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.userId} · {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell className="hidden xl:table-cell">{member.phone}</TableCell>
                    <TableCell className="hidden xl:table-cell">{formatDate(member.birthdate)}</TableCell>
                    <TableCell>{projectName(member.projectId)}</TableCell>
                    <TableCell>
                      <Badge variant={member.isActive ? "default" : "secondary"}>
                        {member.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <MemberForm
                        member={member}
                        trigger={
                          <Button size="sm" variant="ghost" aria-label="Editar miembro">
                            <PencilIcon />
                          </Button>
                        }
                      />
                      <ConfirmDelete
                        title={`¿Eliminar a ${member.name}?`}
                        description="El miembro se quitará del equipo. Esta acción no se puede deshacer."
                        onConfirm={() => deleteMember(member.userId)}
                        trigger={
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label="Eliminar miembro">
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
        )}
      </CardContent>
    </Card>
  )
}
