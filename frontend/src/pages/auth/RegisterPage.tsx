import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../services/authService'
import { saveAuthUser, getRedirectPathByRole } from '../../utils/authStorage'

type FormErrors = {
  nombre?: string
  apellido?: string
  email?: string
  password?: string
  confirmPassword?: string
  telefono?: string
  direccion?: string
}

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const newErrors: FormErrors = {}

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.'
    }

    if (!form.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio.'
    }

    if (!form.email.trim()) {
      newErrors.email = 'El email es obligatorio.'
    }

    if (!form.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria.'
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Debes confirmar la contraseña.'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.'
    }

    if (form.telefono.length > 30) {
      newErrors.telefono = 'El teléfono no puede superar los 30 caracteres.'
    }

    if (form.direccion.length > 255) {
      newErrors.direccion = 'La dirección no puede superar los 255 caracteres.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) return

    try {
      setIsSubmitting(true)
      setServerError(null)

      const user = await register({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        password: form.password,
        telefono: form.telefono.trim(),
        direccion: form.direccion.trim(),
      })

      saveAuthUser(user)
      navigate(getRedirectPathByRole(user.rol), { replace: true })
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'No se pudo registrar el usuario.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Crear cuenta</h1>
        <p className="mt-2 text-slate-500">
          Regístrate para empezar a usar Food Store.
        </p>

        {serverError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, nombre: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500"
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
              onChange={(e) =>
                setForm((prev) => ({ ...prev, apellido: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500"
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
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Teléfono
            </label>
            <input
              type="text"
              value={form.telefono}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, telefono: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500"
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Dirección
            </label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, direccion: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-500"
            />
            {errors.direccion && (
              <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-sky-600 px-4 py-2.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-sky-700 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  )
}