"use client"

import { CheckCircle2Icon, ClockIcon, FolderKanbanIcon, UsersIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LoadingState } from "@/components/common"
import { useDashboard } from "@/components/DashboardProvider"
import { projectProgress, statusVariant } from "@/components/ProjectsTab"
import { initials } from "@/lib/dashboard-data"

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string
  value: string | number
  hint: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

export function OverviewTab() {
  const { loading, projects, tasks, members, activity } = useDashboard()

  if (loading) return <LoadingState text="Cargando métricas..." />

  // Métricas calculadas con los datos en memoria
  const inProgress = projects.filter((p) => p.status === "En progreso").length
  const finishedProjects = projects.filter((p) => p.status === "Completado").length
  const completed = tasks.filter((t) => t.status === "Completado").length
  const pending = tasks.length - completed
  const urgent = tasks.filter((t) => t.status !== "Completado" && t.priority === "Urgente").length
  const active = members.filter((m) => m.isActive).length
  const rate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Proyectos"
          value={projects.length}
          hint={`${inProgress} en progreso · ${finishedProjects} completados`}
          icon={FolderKanbanIcon}
        />
        <StatCard
          title="Tareas Completadas"
          value={completed}
          hint={`${rate}% de ${tasks.length} tareas`}
          icon={CheckCircle2Icon}
        />
        <StatCard title="Tareas Pendientes" value={pending} hint={`${urgent} urgentes por resolver`} icon={ClockIcon} />
        <StatCard title="Miembros Activos" value={active} hint={`de ${members.length} miembros registrados`} icon={UsersIcon} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progreso por Proyecto</CardTitle>
            <CardDescription>Según las tareas completadas de cada proyecto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 && <p className="text-sm text-muted-foreground">No hay proyectos.</p>}
            {projects.map((p) => {
              const progress = projectProgress(p.id, tasks)
              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant(p.status)} className="text-[10px]">
                        {p.status}
                      </Badge>
                      <span className="w-10 text-right text-muted-foreground">{progress}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas actualizaciones de tus proyectos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{initials(item.user)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{item.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.action} <span className="font-medium">{item.target}</span>
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
