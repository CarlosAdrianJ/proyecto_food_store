import { useState } from 'react'
import type { Category, CategoryCreate, CategoryEdit } from '../../types/category'

type CategoryModalProps = {
  mode: 'create' | 'edit'
  category?: Category | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: CategoryCreate | CategoryEdit) => Promise<void>
}

type FormErrors = {
  denominacion?: string
  descripcion?: string
}

export default function CategoryModal({
  mode,
  category,
  isSubmitting,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const [form, setForm] = useState({
    denominacion: mode === 'edit' && category ? category.denominacion ?? '' : '',
    descripcion: mode === 'edit' && category ? category.descripcion ?? '' : '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  function validate() {
    const newErrors: FormErrors = {}

    if (!form.denominacion.trim()) {
      newErrors.denominacion = 'La denominación es obligatoria.'
    } else if (form.denominacion.trim().length > 100) {
      newErrors.denominacion = 'La denominación no puede superar los 100 caracteres.'
    }

    if (form.descripcion.trim().length > 255) {
      newErrors.descripcion = 'La descripción no puede superar los 255 caracteres.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) return

    await onSubmit({
      denominacion: form.denominacion.trim(),
      descripcion: form.descripcion.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-800">
            {mode === 'create' ? 'Nueva categoría' : 'Editar categoría'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Denominación
            </label>
            <input
              type="text"
              value={form.denominacion}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, denominacion: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
              placeholder="Ej: Bebidas"
            />
            {errors.denominacion && (
              <p className="mt-1 text-sm text-red-600">{errors.denominacion}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, descripcion: e.target.value }))
              }
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
              placeholder="Descripción opcional"
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
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
              {isSubmitting
                ? 'Guardando...'
                : mode === 'create'
                ? 'Crear'
                : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}