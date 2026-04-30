import { useState } from 'react'
import type { Category } from '../../types/category'
import type { Product, ProductCreate, ProductEdit } from '../../types/product'

type ProductModalProps = {
  mode: 'create' | 'edit'
  product?: Product | null
  categories: Category[]
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: ProductCreate | ProductEdit) => Promise<void>
}

type FormErrors = {
  denominacion?: string
  descripcion?: string
  precio?: string
  stock?: string
  imagenUrl?: string
  categoriaId?: string
}

export default function ProductModal({
  mode,
  product,
  categories,
  isSubmitting,
  onClose,
  onSubmit,
}: ProductModalProps) {
  const [form, setForm] = useState({
    denominacion: mode === 'edit' && product ? product.denominacion ?? '' : '',
    descripcion: mode === 'edit' && product ? product.descripcion ?? '' : '',
    precio: mode === 'edit' && product ? String(product.precio) : '',
    stock: mode === 'edit' && product ? String(product.stock) : '0',
    disponible: mode === 'edit' && product ? product.disponible : true,
    imagenUrl: mode === 'edit' && product ? product.imagenUrl ?? '' : '',
    categoriaId:
      mode === 'edit' && product ? String(product.categoriaId) : '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  function validate() {
    const newErrors: FormErrors = {}

    if (!form.denominacion.trim()) {
      newErrors.denominacion = 'La denominación es obligatoria.'
    } else if (form.denominacion.trim().length > 150) {
      newErrors.denominacion =
        'La denominación no puede superar los 150 caracteres.'
    }

    if (form.descripcion.trim().length > 500) {
      newErrors.descripcion =
        'La descripción no puede superar los 500 caracteres.'
    }

    if (!form.precio.trim()) {
      newErrors.precio = 'El precio es obligatorio.'
    } else {
      const precio = Number(form.precio)
      if (Number.isNaN(precio) || precio <= 0) {
        newErrors.precio = 'El precio debe ser mayor a 0.'
      }
    }

    if (!form.stock.trim()) {
      newErrors.stock = 'El stock es obligatorio.'
    } else {
      const stock = Number(form.stock)
      if (!Number.isInteger(stock) || stock < 0) {
        newErrors.stock = 'El stock no puede ser negativo.'
      }
    }

    if (form.imagenUrl.trim().length > 500) {
      newErrors.imagenUrl = 'La imagenUrl no puede superar los 500 caracteres.'
    }

    if (!form.categoriaId.trim()) {
      newErrors.categoriaId = 'La categoría es obligatoria.'
    } else {
      const categoriaId = Number(form.categoriaId)
      if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
        newErrors.categoriaId = 'La categoría seleccionada no es válida.'
      }
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
      precio: Number(form.precio),
      stock: Number(form.stock),
      disponible: form.disponible,
      imagenUrl: form.imagenUrl.trim(),
      categoriaId: Number(form.categoriaId),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-800">
            {mode === 'create' ? 'Nuevo producto' : 'Editar producto'}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 px-6 py-5 md:grid-cols-2"
        >
          <div className="md:col-span-2">
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
              placeholder="Ej: Hamburguesa Clásica"
            />
            {errors.denominacion && (
              <p className="mt-1 text-sm text-red-600">{errors.denominacion}</p>
            )}
          </div>

          <div className="md:col-span-2">
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

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Precio
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.precio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, precio: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
              placeholder="0.00"
            />
            {errors.precio && (
              <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Stock
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, stock: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
              placeholder="0"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Categoría
            </label>
            <select
              value={form.categoriaId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, categoriaId: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.denominacion}
                </option>
              ))}
            </select>
            {errors.categoriaId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoriaId}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Imagen URL
            </label>
            <input
              type="text"
              value={form.imagenUrl}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, imagenUrl: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
              placeholder="https://..."
            />
            {errors.imagenUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imagenUrl}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
              <input
                type="checkbox"
                checked={form.disponible}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, disponible: e.target.checked }))
                }
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-slate-700">
                Producto disponible
              </span>
            </label>
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