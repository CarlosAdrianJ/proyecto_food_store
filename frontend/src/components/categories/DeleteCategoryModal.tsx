type DeleteCategoryModalProps = {
  categoryName?: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteCategoryModal({
  categoryName,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Confirmar eliminación
          </h2>
        </div>

        <div className="px-6 py-5">
          <p className="text-slate-600">
            ¿Seguro que deseas eliminar la categoría{' '}
            <span className="font-semibold text-slate-800">
              {categoryName || ''}
            </span>
            ?
          </p>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
              disabled={isDeleting}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => void onConfirm()}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-60"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}