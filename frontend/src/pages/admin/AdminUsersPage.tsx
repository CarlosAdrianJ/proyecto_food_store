import { useEffect, useState } from 'react'
import DeleteUserModal from '../../components/users/DeleteUserModal'
import UserModal from '../../components/users/UserModal'
import { deleteUser, getAllUsers, updateUser } from '../../services/userService'
import type { User, UserEdit } from '../../types/user'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function loadUsers() {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  async function handleUpdateUser(payload: UserEdit) {
    if (!userToEdit) return

    try {
      setIsSubmitting(true)
      setError(null)
      await updateUser(userToEdit.id, payload)
      setUserToEdit(null)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el usuario.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete) return

    try {
      setIsDeleting(true)
      setError(null)
      await deleteUser(userToDelete.id)
      setUserToDelete(null)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el usuario.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">
            Administración de usuarios
          </h1>
          <p className="mt-1 text-slate-500">
            Lista, edición y eliminación lógica de usuarios.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Tabla de usuarios
            </h2>
          </div>

          {loading ? (
            <div className="px-6 py-8 text-slate-500">Cargando usuarios...</div>
          ) : users.length === 0 ? (
            <div className="px-6 py-8 text-slate-500">
              No hay usuarios registrados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Rol</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Teléfono</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-6 py-4 text-sm text-slate-700">{user.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {user.nombre} {user.apellido}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.rol}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.telefono || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setUserToEdit(user)}
                            className="rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => setUserToDelete(user)}
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

      {userToEdit && (
        <UserModal
          user={userToEdit}
          isSubmitting={isSubmitting}
          onClose={() => {
            if (isSubmitting) return
            setUserToEdit(null)
          }}
          onSubmit={handleUpdateUser}
        />
      )}

      {userToDelete && (
        <DeleteUserModal
          userName={`${userToDelete.nombre} ${userToDelete.apellido}`}
          isDeleting={isDeleting}
          onClose={() => {
            if (isDeleting) return
            setUserToDelete(null)
          }}
          onConfirm={handleDeleteUser}
        />
      )}
    </main>
  )
}