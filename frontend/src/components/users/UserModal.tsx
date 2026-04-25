import { useState } from 'react'
import type { Role } from '../../types/auth'
import type { User, UserEdit } from '../../types/user'

type UserModalProps = {
  user: User
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: UserEdit) => Promise<void>
}

type FormErrors = {
  nombre?: string
  apellido?: string
  email?: string
  telefono?: string
  direccion?: string
}

export default function UserModal({
  user,
  isSubmitting,
  onClose,
  onSubmit,
}: UserModalProps) {
  const [form, setForm] = useState<UserEdit>({
    nombre: user.nombre ?? '',
    apellido: user.apellido ?? '',
    email: user.email ?? '',
    telefono: user.telefono ?? '',
    direccion: user.direccion ?? '',
    rol: user.rol,
  })

  const [errors, setErrors] = useState<FormErrors>({})

  function validate() {
    const newErrors: FormErrors = {}

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.'
    } else if (form.nombre.trim().length > 100) {
      newErrors.nombre = 'El nombre no puede superar los 100 caracteres.'
    }

    if (!form.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio.'
    } else if (form.apellido.trim().length > 100) {
      newErrors.apellido = 'El apellido no puede superar los 100 caracteres.'
    }

    if (!form.email.trim()) {
      newErrors.email = 'El email es obligatorio.'
    } else if (form.email.trim().length > 150) {
      newErrors.email = 'El email no puede superar los 150 caracteres.'
    }

    if (form.telefono.trim().length > 30) {
      newErrors.telefono = 'El teléfono no puede superar los 30 caracteres.'
    }

    if (form.direccion.trim().length > 255) {
      newErrors.direccion = 'La dirección no puede superar los 255 caracteres.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) return

    await onSubmit({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      rol: form.rol as Role,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Editar usuario
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Apellido
            </label>
            <input
              type="text"
              value={form.apellido}
              onChange={(e) => setForm((prev) => ({ ...prev, apellido: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
            {errors.apellido && (
              <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Teléfono
            </label>
            <input
              type="text"
              value={form.telefono}
              onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Rol
            </label>
            <select
              value={form.rol}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, rol: e.target.value as Role }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            >
              <option value="USUARIO">USUARIO</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Dirección
            </label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => setForm((prev) => ({ ...prev, direccion: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
            {errors.direccion && (
              <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
            )}
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}