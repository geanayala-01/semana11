// Tipos y datos iniciales del dashboard (se guardan solo en memoria)

export type ProjectStatus = "Planificado" | "En progreso" | "En revisión" | "Completado"
export type Priority = "Baja" | "Media" | "Alta" | "Urgente"
export type TaskStatus = "Pendiente" | "En progreso" | "Completado"
export type Role = "Administrador" | "Líder" | "Miembro"

export interface Project {
  id: string
  name: string
  description: string
  category: string
  priority: Priority
  status: ProjectStatus
  endDate: string // yyyy-MM-dd
}

export interface Member {
  userId: string
  role: Role
  name: string
  email: string
  position: string
  birthdate: string // yyyy-MM-dd
  phone: string
  projectId: string // "" si no tiene proyecto
  isActive: boolean
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: Priority
  userId: string
  deadline: string // yyyy-MM-dd
}

export interface Settings {
  organization: string
  adminEmail: string
  language: string
  timezone: string
  itemsPerPage: number
  emailNotifications: boolean
  taskReminders: boolean
}

export interface Activity {
  id: string
  user: string
  action: string
  target: string
  time: string
}

export const CATEGORIES: Record<string, string> = {
  web: "Desarrollo Web",
  mobile: "Desarrollo Mobile",
  design: "Diseño",
  marketing: "Marketing",
  other: "Otro",
}

export const PROJECT_STATUSES: ProjectStatus[] = ["Planificado", "En progreso", "En revisión", "Completado"]
export const PRIORITIES: Priority[] = ["Baja", "Media", "Alta", "Urgente"]
export const TASK_STATUSES: TaskStatus[] = ["Pendiente", "En progreso", "Completado"]
export const ROLES: Role[] = ["Administrador", "Líder", "Miembro"]

export const initialProjects: Project[] = [
  { id: "P001", name: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "web", priority: "Alta", status: "En progreso", endDate: "2026-12-15" },
  { id: "P002", name: "Mobile App", description: "Aplicación móvil con React Native", category: "mobile", priority: "Media", status: "En revisión", endDate: "2026-11-30" },
  { id: "P003", name: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "web", priority: "Media", status: "Planificado", endDate: "2027-01-20" },
  { id: "P004", name: "API Gateway", description: "Microservicios con Node.js", category: "web", priority: "Urgente", status: "En progreso", endDate: "2026-12-05" },
  { id: "P005", name: "Design System", description: "Librería de componentes reutilizables", category: "design", priority: "Baja", status: "Completado", endDate: "2026-10-20" },
]

export const initialMembers: Member[] = [
  { userId: "U001", role: "Líder", name: "María García", email: "maria@example.com", position: "Frontend Developer", birthdate: "1996-04-12", phone: "987654321", projectId: "P001", isActive: true },
  { userId: "U002", role: "Miembro", name: "Juan Pérez", email: "juan@example.com", position: "Backend Developer", birthdate: "1994-09-03", phone: "912345678", projectId: "P004", isActive: true },
  { userId: "U003", role: "Miembro", name: "Ana López", email: "ana@example.com", position: "UI/UX Designer", birthdate: "1998-01-25", phone: "956781234", projectId: "P002", isActive: false },
  { userId: "U004", role: "Miembro", name: "Carlos Ruiz", email: "carlos@example.com", position: "DevOps Engineer", birthdate: "1992-07-18", phone: "923456789", projectId: "P004", isActive: true },
  { userId: "U005", role: "Administrador", name: "Laura Martínez", email: "laura@example.com", position: "Project Manager", birthdate: "1990-11-30", phone: "945612378", projectId: "P003", isActive: true },
  { userId: "U006", role: "Miembro", name: "Diego Torres", email: "diego@example.com", position: "Mobile Developer", birthdate: "1999-05-08", phone: "934567812", projectId: "P002", isActive: true },
  { userId: "U007", role: "Miembro", name: "Sofía Ramos", email: "sofia@example.com", position: "QA Tester", birthdate: "1997-02-14", phone: "978123456", projectId: "P001", isActive: true },
  { userId: "U008", role: "Miembro", name: "Luis Fernández", email: "luis@example.com", position: "Frontend Developer", birthdate: "2000-08-21", phone: "965432187", projectId: "P005", isActive: true },
]

export const initialTasks: Task[] = [
  { id: "T001", description: "Implementar autenticación", projectId: "P001", status: "En progreso", priority: "Alta", userId: "U001", deadline: "2026-11-15" },
  { id: "T002", description: "Diseñar pantalla de perfil", projectId: "P002", status: "Pendiente", priority: "Media", userId: "U003", deadline: "2026-11-20" },
  { id: "T003", description: "Configurar CI/CD", projectId: "P004", status: "Completado", priority: "Alta", userId: "U004", deadline: "2026-11-10" },
  { id: "T004", description: "Optimizar queries SQL", projectId: "P001", status: "En progreso", priority: "Urgente", userId: "U002", deadline: "2026-11-12" },
  { id: "T005", description: "Documentar API endpoints", projectId: "P004", status: "Pendiente", priority: "Baja", userId: "U005", deadline: "2026-11-25" },
  { id: "T006", description: "Carrito de compras", projectId: "P001", status: "Completado", priority: "Alta", userId: "U007", deadline: "2026-11-05" },
  { id: "T007", description: "Notificaciones push", projectId: "P002", status: "En progreso", priority: "Media", userId: "U006", deadline: "2026-11-22" },
  { id: "T008", description: "Definir métricas del panel", projectId: "P003", status: "Pendiente", priority: "Media", userId: "U005", deadline: "2026-12-01" },
  { id: "T009", description: "Componentes de botones y tarjetas", projectId: "P005", status: "Completado", priority: "Baja", userId: "U008", deadline: "2026-10-15" },
  { id: "T010", description: "Pruebas de pasarela de pago", projectId: "P001", status: "Pendiente", priority: "Urgente", userId: "U007", deadline: "2026-11-28" },
  { id: "T011", description: "Rate limiting en el gateway", projectId: "P004", status: "En progreso", priority: "Alta", userId: "U002", deadline: "2026-11-18" },
  { id: "T012", description: "Publicar en Play Store", projectId: "P002", status: "Pendiente", priority: "Alta", userId: "U006", deadline: "2026-11-29" },
]

export const initialSettings: Settings = {
  organization: "Tecsup",
  adminEmail: "admin@tecsup.edu.pe",
  language: "es",
  timezone: "America/Lima",
  itemsPerPage: 5,
  emailNotifications: true,
  taskReminders: false,
}

export const initialActivity: Activity[] = [
  { id: "A1", user: "María García", action: "completó la tarea", target: "Diseño de UI", time: "Hace 5 min" },
  { id: "A2", user: "Juan Pérez", action: "comentó en", target: "API Backend", time: "Hace 1 hora" },
  { id: "A3", user: "Ana López", action: "creó un nuevo", target: "Proyecto Mobile", time: "Hace 2 horas" },
  { id: "A4", user: "Carlos Ruiz", action: "actualizó", target: "Documentación", time: "Hace 3 horas" },
]

export function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

// Genera el siguiente id con prefijo: P006, U009, T013...
export function nextId(prefix: string, ids: string[]) {
  const max = ids.reduce((acc, id) => Math.max(acc, Number(id.slice(1)) || 0), 0)
  return `${prefix}${String(max + 1).padStart(3, "0")}`
}
