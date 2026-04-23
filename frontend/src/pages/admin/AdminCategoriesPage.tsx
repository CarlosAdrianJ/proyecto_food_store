import { useEffect, useState } from 'react'
import CategoryModal from '../../components/categories/CategoryModal'
import DeleteCategoryModal from '../../components/categories/DeleteCategoryModal'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '../../services/categoryService'
import type { Category, CategoryCreate, CategoryEdit } from '../../types/category'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function loadCategories() {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllCategories()
      setCategories(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar las categorías.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCategories()
  }, [])

  function handleOpenCreate() {
    setSelectedCategory(null)
    setModalMode('create')
    setModalOpen(true)
  }

  function handleOpenEdit(category: Category) {
    setSelectedCategory(category)
    setModalMode('edit')
    setModalOpen(true)
  }

  function handleOpenDelete(category: Category) {
    setCategoryToDelete(category)
    setDeleteModalOpen(true)
  }

  async function handleSubmitCategory(payload: CategoryCreate | CategoryEdit) {
    try {
      setIsSubmitting(true)
      setError(null)

      if (modalMode === 'create') {
        await createCategory(payload)
      } else if (selectedCategory) {
        await updateCategory(selectedCategory.id, payload)
      }

      setModalOpen(false)
      setSelectedCategory(null)
      await loadCategories()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar la categoría.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) return

    try {
      setIsDeleting(true)
      setError(null)

      await deleteCategory(categoryToDelete.id)

      setDeleteModalOpen(false)
      setCategoryToDelete(null)
      await loadCategories()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar la categoría.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Administración de categorías
            </h1>
            <p className="mt-1 text-slate-500">
              Alta, edición y eliminación lógica de categorías.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-xl bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700"
          >
            Nueva categoría
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Tabla de categorías
            </h2>
          </div>

          {loading ? (
            <div className="px-6 py-8 text-slate-500">Cargando categorías...</div>
          ) : categories.length === 0 ? (
            <div className="px-6 py-8 text-slate-500">
              No hay categorías registradas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Denominación
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-t">
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {category.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {category.denominacion}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {category.descripcion || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(category)}
                            className="rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => handleOpenDelete(category)}
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <CategoryModal
          mode={modalMode}
          category={selectedCategory}
          isSubmitting={isSubmitting}
          onClose={() => {
            if (isSubmitting) return
            setModalOpen(false)
            setSelectedCategory(null)
          }}
          onSubmit={handleSubmitCategory}
        />
      )}

      {deleteModalOpen && categoryToDelete && (
        <DeleteCategoryModal
          categoryName={categoryToDelete.denominacion}
          isDeleting={isDeleting}
          onClose={() => {
            if (isDeleting) return
            setDeleteModalOpen(false)
            setCategoryToDelete(null)
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </main>
  )
}