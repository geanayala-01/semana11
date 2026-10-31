"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { es as dayPickerEs } from "react-day-picker/locale"
import { AlertCircleIcon, CalendarIcon, CheckCircle2Icon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"

export const formatDate = (value: string) =>
  value ? format(parseISO(value), "dd MMM yyyy", { locale: es }) : "—"

// Selector de fecha: Popover + Calendar de shadcn/ui
export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Selecciona una fecha",
  birthdate = false,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  birthdate?: boolean
}) {
  const [open, setOpen] = useState(false)
  const selected = value ? parseISO(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button id={id} type="button" variant="outline" className="w-full justify-start font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(selected!, "PPP", { locale: es }) : <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={dayPickerEs}
          selected={selected}
          defaultMonth={selected ?? (birthdate ? new Date(2000, 0, 1) : undefined)}
          captionLayout={birthdate ? "dropdown" : "label"}
          startMonth={birthdate ? new Date(1950, 0) : undefined}
          endMonth={birthdate ? new Date() : undefined}
          disabled={birthdate ? { after: new Date() } : undefined}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "")
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

// Alert para mostrar errores de validación de un formulario
export function FormErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null
  return (
    <Alert variant="destructive" className="border-destructive/40 bg-destructive/5">
      <AlertCircleIcon />
      <AlertTitle>Revisa el formulario</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

export function SuccessAlert({ title, message }: { title: string; message: string }) {
  return (
    <Alert className="border-primary/30 bg-primary/5 text-primary">
      <CheckCircle2Icon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

// Botón que muestra el Spinner mientras se "envía" al backend
export function SaveButton({ saving, children }: { saving: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" disabled={saving}>
      {saving ? (
        <>
          <Spinner /> Guardando...
        </>
      ) : (
        children
      )}
    </Button>
  )
}

export function LoadingState({ text = "Cargando datos..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
      <Spinner className="size-6 text-primary" />
      {text}
    </div>
  )
}

// Confirmación antes de eliminar (AlertDialog)
export function ConfirmDelete({
  title,
  description,
  onConfirm,
  trigger,
}: {
  title: string
  description: string
  onConfirm: () => Promise<void>
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Spinner /> Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
