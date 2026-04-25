import { useNavigate } from 'react-router-dom'
import { clearAuthUser } from '../../utils/authStorage'

export default function LogoutButton() {
  const navigate = useNavigate()

  function handleLogout() {
    clearAuthUser()
    navigate('/login', { replace: true })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
    >
      Cerrar sesión
    </button>
  )
}