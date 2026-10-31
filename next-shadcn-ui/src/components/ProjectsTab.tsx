"use client"

import { PencilIcon, Trash2Icon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ConfirmDelete, LoadingState, formatDate } from "@/components/common"
import { useDashboard } from "@/components/DashboardProvider"
import { ProjectForm } from "@/components/ProjectForm"
import { CATEGORIES, type Project, type Task, initials } from "@/lib/dashboard-data"

export const statusVariant = (status: string) =>
  status === "Completado" ? "default" : status === "En revisión" || status === "En progreso" ? "secondary" : "outline"

export const priorityVariant = (priority: string) =>
  priority === "Urgente" ? "destructive" : priority === "Alta" ? "default" : priority === "Media" ? "secondary" : "outline"

// Progreso = tareas completadas / total de tareas del proyecto
export const projectProgress = (projectId: string, tasks: Task[]) => {
  const list = tasks.filter((t) => t.projectId === projectId)
  if (list.length === 0) return 0
  return Math.round((list.filter((t) => t.status === "Completado").length / list.length) * 100)
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div className="h-full bg-primary transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}

function ProjectDetails({ project }: { project: Project }) {
  const { members, tasks } = useDashboard()
  const team = members.filter((m) => m.projectId === project.id)
  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const progress = projectProgress(project.id, tasks)
  const memberName = (id: string) => members.find((m) => m.userId === id)?.name ?? "Sin asignar"

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          Ver detalles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl">{project.name}</DialogTitle>
            <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
          </div>
          <DialogDescription>{project.description || "Sin descripción"}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Código</p>
            <p className="font-medium">{project.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Categoría</p>
            <p className="font-medium">{CATEGORIES[project.category]}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Prioridad</p>
            <Badge variant={priorityVariant(project.priority)}>{project.priority}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Entrega</p>
            <p className="font-medium">{formatDate(project.endDate)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 font-semibold">Miembros del equipo ({team.length})</h4>
          {team.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay miembros asignados.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {team.map((m) => (
                <div key={m.userId} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{initials(m.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-muted-foreground">{m.position}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 font-semibold">Tareas ({projectTasks.length})</h4>
          {projectTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Este proyecto no tiene tareas.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {projectTasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {memberName(t.userId)} · {formatDate(t.deadline)}
                    </p>
                  </div>
                  <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ProjectsTab() {
  const { loading, projects, members, tasks, deleteProject } = useDashboard()

  if (loading) return <LoadingState text="Cargando proyectos..." />

  if (projects.length === 0)
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No hay proyectos. Crea uno con el botón &quot;Nuevo Proyecto&quot;.
        </CardContent>
      </Card>
    )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const progress = projectProgress(project.id, tasks)
        const team = members.filter((m) => m.projectId === project.id)
        return (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <ProgressBar value={progress} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {team.slice(0, 4).map((m) => (
                      <Avatar key={m.userId} className="h-7 w-7 border-2 border-background">
                        <AvatarFallback className="text-[10px]">{initials(m.name)}</AvatarFallback>
                      </Avatar>
                    ))}
                    <span className="pl-3 text-sm text-muted-foreground">{team.length} miembros</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(project.endDate)}</span>
                </div>
                <div className="flex items-center justify-end gap-1 border-t pt-3">
                  <ProjectDetails project={project} />
                  <ProjectForm
                    project={project}
                    trigger={
                      <Button size="sm" variant="ghost" aria-label="Editar proyecto">
                        <PencilIcon />
                      </Button>
                    }
                  />
                  <ConfirmDelete
                    title={`¿Eliminar "${project.name}"?`}
                    description="Se eliminarán también sus tareas y los miembros quedarán sin proyecto. Esta acción no se puede deshacer."
                    onConfirm={() => deleteProject(project.id)}
                    trigger={
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label="Eliminar proyecto">
                        <Trash2Icon />
                      </Button>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
