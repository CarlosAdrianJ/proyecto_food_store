import { useState } from 'react'
import type { CartItem } from '../../utils/cartStorage'
import type { FormaPago } from '../../types/order'

type CheckoutFormData = {
  telefonoEntrega: string
  direccionEntrega: string
  notasAdicionales: string
}

type CheckoutConfirmModalProps = {
  isOpen: boolean
  items: CartItem[]
  total: number
  formaPago: FormaPago
  isSubmitting: boolean
  onClose: () => void
  onConfirm: (formData: CheckoutFormData) => Promise<void>
}

type FormErrors = {
  telefonoEntrega?: string
  direccionEntrega?: string
  notasAdicionales?: string
}

export default function CheckoutConfirmModal({
  isOpen,
  items,
  total,
  formaPago,
  isSubmitting,
  onClose,
  onConfirm,
}: CheckoutConfirmModalProps) {
  const [form, setForm] = useState<CheckoutFormData>({
    telefonoEntrega: '',
    direccionEntrega: '',
    notasAdicionales: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  function resetForm() {
    setForm({
      telefonoEntrega: '',
      direccionEntrega: '',
      notasAdicionales: '',
    })

    setErrors({})
  }

  function handleClose() {
    if (isSubmitting) return

    resetForm()
    onClose()
  }

  if (!isOpen) return null

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0)

  function validate() {
    const newErrors: FormErrors = {}

    if (!form.telefonoEntrega.trim()) {
      newErrors.telefonoEntrega = 'El teléfono es obligatorio.'
    } else if (form.telefonoEntrega.trim().length > 30) {
      newErrors.telefonoEntrega = 'El teléfono no puede superar los 30 caracteres.'
    }

    if (!form.direccionEntrega.trim()) {
      newErrors.direccionEntrega = 'La dirección es obligatoria.'
    } else if (form.direccionEntrega.trim().length > 255) {
      newErrors.direccionEntrega = 'La dirección no puede superar los 255 caracteres.'
    }

    if (form.notasAdicionales.trim().length > 500) {
      newErrors.notasAdicionales = 'Las notas no pueden superar los 500 caracteres.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) return

    await onConfirm({
      telefonoEntrega: form.telefonoEntrega.trim(),
      direccionEntrega: form.direccionEntrega.trim(),
      notasAdicionales: form.notasAdicionales.trim(),
    })

    resetForm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">
            Confirmar pedido
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Revisa tu compra y completa los datos de entrega.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Productos</p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                {totalItems}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Ítems distintos</p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                {items.length}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Forma de pago</p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                {formaPago}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Resumen del pedido
            </h3>

            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {item.denominacion}
                    </p>

                    <p className="text-sm text-slate-500">
                      {item.cantidad} x ${item.precio.toFixed(2)}
                    </p>
                  </div>

                  <p className="font-bold text-slate-800">
                    ${(item.cantidad * item.precio).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Número de teléfono
              </label>

              <input
                type="text"
                value={form.telefonoEntrega}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    telefonoEntrega: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
                placeholder="Ej: 0999999999"
              />

              {errors.telefonoEntrega && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telefonoEntrega}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Dirección de entrega
              </label>

              <input
                type="text"
                value={form.direccionEntrega}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    direccionEntrega: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
                placeholder="Ej: Av. Principal 123"
              />

              {errors.direccionEntrega && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.direccionEntrega}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Notas adicionales
              </label>

              <textarea
                value={form.notasAdicionales}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    notasAdicionales: e.target.value,
                  }))
                }
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-orange-500"
                placeholder="Ej: tocar timbre, entregar en portería, sin cebolla..."
              />

              {errors.notasAdicionales && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.notasAdicionales}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-5 py-4">
            <span className="text-lg font-semibold text-slate-700">
              Total
            </span>

            <span className="text-2xl font-bold text-slate-900">
              ${total.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-orange-500 px-5 py-2 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar compra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}