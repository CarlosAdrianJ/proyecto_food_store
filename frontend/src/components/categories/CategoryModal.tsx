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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-orange-100">
        
        {/* Header con gradiente cálido (Amarillo -> Naranja -> Rojo) */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 px-6 py-5">
          <h2 className="text-xl font-bold text-white drop-shadow-sm">
            {mode === 'create' ? 'Nueva categoría' : 'Editar categoría'}
          </h2>
          <p className="text-sm text-orange-50/90">
            {mode === 'create' 
              ? 'Define una nueva clasificación para tus productos.' 
              : `Modificando: ${category?.denominacion}`}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          
          {/* Input Denominación con foco en Naranja */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Denominación
            </label>
            <input
              type="text"
              value={form.denominacion}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, denominacion: e.target.value }))
              }
              className={`w-full rounded-xl border px-4 py-2.5 text-slate-700 transition-all outline-none focus:ring-4 focus:ring-amber-500/10 ${
                errors.denominacion 
                  ? 'border-red-400 bg-red-50 focus:border-red-500' 
                  : 'border-slate-200 focus:border-orange-500'
              }`}
              placeholder="Ej: Snacks salados"
              disabled={isSubmitting}
            />
            {errors.denominacion && (
              <p className="mt-1.5 text-xs font-bold text-red-600 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-red-600" /> {errors.denominacion}
              </p>
            )}
          </div>

          {/* Textarea Descripción */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Descripción <span className="font-normal text-slate-400">(Opcional)</span>
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, descripcion: e.target.value }))
              }
              rows={4}
              className={`w-full resize-none rounded-xl border px-4 py-2.5 text-slate-700 transition-all outline-none focus:ring-4 focus:ring-amber-500/10 ${
                errors.descripcion 
                  ? 'border-red-400 bg-red-50 focus:border-red-500' 
                  : 'border-slate-200 focus:border-orange-500'
              }`}
              placeholder="Detalles adicionales sobre esta categoría..."
              disabled={isSubmitting}
            />
            {errors.descripcion && (
              <p className="mt-1.5 text-xs font-bold text-red-600 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-red-600" /> {errors.descripcion}
              </p>
            )}
          </div>

          {/* Footer de Acciones (Botones cálidos) */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="group relative flex items-center justify-center overflow-hidden rounded-xl bg-orange-600 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 focus:ring-4 focus:ring-orange-500/30 disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : mode === 'create' ? (
                'Crear ahora'
              ) : (
                'Actualizar categoría'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}