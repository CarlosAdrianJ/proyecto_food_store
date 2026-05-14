type OrderSuccessModalProps = {
  isOpen: boolean
  orderId: number | null
  total: number
  onGoToOrders: () => void
  onContinueShopping: () => void
}

export default function OrderSuccessModal({
  isOpen,
  orderId,
  total,
  onGoToOrders,
  onContinueShopping,
}: OrderSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="px-6 py-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            ✅
          </div>

          <h2 className="mt-4 text-2xl font-bold text-slate-800">
            Pedido realizado con éxito
          </h2>

          <p className="mt-2 text-slate-500">
            Tu compra fue registrada correctamente.
          </p>

          <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Número de pedido</span>
              <span className="font-semibold text-slate-800">
                #{orderId ?? '-'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-lg font-bold text-slate-900">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onGoToOrders}
              className="rounded-xl bg-orange-500 px-5 py-2.5 font-medium text-white hover:bg-orange-600"
            >
              Ir a Mis Pedidos
            </button>

            <button
              type="button"
              onClick={onContinueShopping}
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}