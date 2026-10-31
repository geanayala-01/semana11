"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormErrors, LoadingState, SaveButton, SuccessAlert, isEmail } from "@/components/common"
import { useDashboard } from "@/components/DashboardProvider"
import type { Settings } from "@/lib/dashboard-data"

function SettingsForm({ initial }: { initial: Settings }) {
  const { saveSettings } = useDashboard()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const list: string[] = []
    if (!form.organization.trim()) list.push("Ingresa el nombre de la organización.")
    if (!isEmail(form.adminEmail)) list.push("El email del administrador no es válido.")
    setErrors(list)
    setSaved(false)
    if (list.length > 0) return
    setSaving(true)
    await saveSettings({ ...form, organization: form.organization.trim() })
    setSaving(false)
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormErrors errors={errors} />
      {saved && <SuccessAlert title="Configuración guardada" message="Los cambios se aplicaron correctamente." />}

      <div>
        <h3 className="mb-4 font-semibold">General</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="organization">Organización</Label>
            <Input id="organization" value={form.organization} onChange={(e) => set("organization", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="adminEmail">Email del administrador</Label>
            <Input id="adminEmail" value={form.adminEmail} onChange={(e) => set("adminEmail", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Idioma</Label>
            <Select value={form.language} onValueChange={(v) => set("language", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">Inglés</SelectItem>
                <SelectItem value="pt">Portugués</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Zona horaria</Label>
            <Select value={form.timezone} onValueChange={(v) => set("timezone", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Tareas por página</Label>
            <Select value={String(form.itemsPerPage)} onValueChange={(v) => set("itemsPerPage", Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[3, 5, 10, 20].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} tareas
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 font-semibold">Notificaciones</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="emailNotifications">Notificaciones por email</Label>
              <p className="text-sm text-muted-foreground">Recibe un correo cuando te asignen una tarea.</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={form.emailNotifications}
              onCheckedChange={(v) => set("emailNotifications", v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="taskReminders">Recordatorios de tareas</Label>
              <p className="text-sm text-muted-foreground">Aviso un día antes de la fecha límite.</p>
            </div>
            <Switch id="taskReminders" checked={form.taskReminders} onCheckedChange={(v) => set("taskReminders", v)} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => {
            setForm(initial)
            setErrors([])
            setSaved(false)
          }}
        >
          Descartar
        </Button>
        <SaveButton saving={saving}>Guardar Configuración</SaveButton>
      </div>
    </form>
  )
}

export function SettingsTab() {
  const { loading, settings } = useDashboard()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
        <CardDescription>Administra las preferencias de tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>{loading ? <LoadingState /> : <SettingsForm initial={settings} />}</CardContent>
    </Card>
  )
}
