"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type Activity,
  type Member,
  type Project,
  type Settings,
  type Task,
  initialActivity,
  initialMembers,
  initialProjects,
  initialSettings,
  initialTasks,
  nextId,
} from "@/lib/dashboard-data"

// Simula la demora de una petición al backend
export const fakeRequest = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms))

interface DashboardContextValue {
  loading: boolean
  projects: Project[]
  members: Member[]
  tasks: Task[]
  settings: Settings
  activity: Activity[]
  saveProject: (project: Omit<Project, "id"> & { id?: string }, memberIds: string[]) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  saveMember: (member: Member, isNew: boolean) => Promise<void>
  deleteMember: (userId: string) => Promise<void>
  saveTask: (task: Omit<Task, "id"> & { id?: string }) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setTaskStatus: (ids: string[], status: Task["status"]) => void
  saveSettings: (settings: Settings) => Promise<void>
  nextUserId: () => string
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [activity, setActivity] = useState<Activity[]>([])

  // Carga inicial simulada
  useEffect(() => {
    fakeRequest(1200).then(() => {
      setProjects(initialProjects)
      setMembers(initialMembers)
      setTasks(initialTasks)
      setActivity(initialActivity)
      setLoading(false)
    })
  }, [])

  const log = (action: string, target: string) => {
    const time = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
    setActivity((prev) => [
      { id: crypto.randomUUID(), user: "Tú", action, target, time: `Hoy, ${time}` },
      ...prev,
    ].slice(0, 6))
  }

  const saveProject: DashboardContextValue["saveProject"] = async (data, memberIds) => {
    await fakeRequest()
    const id = data.id ?? nextId("P", projects.map((p) => p.id))
    const project = { ...data, id }
    setProjects((prev) => (data.id ? prev.map((p) => (p.id === id ? project : p)) : [...prev, project]))
    // Los miembros elegidos pasan a este proyecto; los que se quitaron quedan sin proyecto
    setMembers((prev) =>
      prev.map((m) =>
        memberIds.includes(m.userId)
          ? { ...m, projectId: id }
          : m.projectId === id
          ? { ...m, projectId: "" }
          : m
      )
    )
    log(data.id ? "actualizó el proyecto" : "creó el proyecto", project.name)
  }

  const deleteProject = async (id: string) => {
    await fakeRequest()
    const project = projects.find((p) => p.id === id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasks((prev) => prev.filter((t) => t.projectId !== id))
    setMembers((prev) => prev.map((m) => (m.projectId === id ? { ...m, projectId: "" } : m)))
    if (project) log("eliminó el proyecto", project.name)
  }

  const saveMember = async (member: Member, isNew: boolean) => {
    await fakeRequest()
    setMembers((prev) => (isNew ? [...prev, member] : prev.map((m) => (m.userId === member.userId ? member : m))))
    log(isNew ? "agregó al miembro" : "actualizó al miembro", member.name)
  }

  const deleteMember = async (userId: string) => {
    await fakeRequest()
    const member = members.find((m) => m.userId === userId)
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
    if (member) log("eliminó al miembro", member.name)
  }

  const saveTask: DashboardContextValue["saveTask"] = async (data) => {
    await fakeRequest()
    const id = data.id ?? nextId("T", tasks.map((t) => t.id))
    const task = { ...data, id }
    setTasks((prev) => (data.id ? prev.map((t) => (t.id === id ? task : t)) : [task, ...prev]))
    log(data.id ? "actualizó la tarea" : "creó la tarea", task.description)
  }

  const deleteTask = async (id: string) => {
    await fakeRequest()
    const task = tasks.find((t) => t.id === id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (task) log("eliminó la tarea", task.description)
  }

  const setTaskStatus = (ids: string[], status: Task["status"]) => {
    setTasks((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, status } : t)))
    if (ids.length === 1) {
      const task = tasks.find((t) => t.id === ids[0])
      if (task && status === "Completado") log("completó la tarea", task.description)
    }
  }

  const saveSettings = async (data: Settings) => {
    await fakeRequest(1200)
    setSettings(data)
    log("actualizó la", "configuración")
  }

  const nextUserId = () => nextId("U", members.map((m) => m.userId))

  return (
    <DashboardContext.Provider
      value={{
        loading,
        projects,
        members,
        tasks,
        settings,
        activity,
        saveProject,
        deleteProject,
        saveMember,
        deleteMember,
        saveTask,
        deleteTask,
        setTaskStatus,
        saveSettings,
        nextUserId,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard debe usarse dentro de DashboardProvider")
  return ctx
}
