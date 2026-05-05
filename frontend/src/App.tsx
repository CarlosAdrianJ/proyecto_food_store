import type { ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LogoutButton from "./components/auth/LogoutButton";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import StoreHomePage from "./pages/store/StoreHomePage";
import { getAuthUser, getRedirectPathByRole } from "./utils/authStorage";
import ProductDetailPage from "./pages/store/ProductDetailPage";
import CartPage from "./pages/store/CartPage";
import MyOrdersPage from "./pages/store/MyOrdersPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";

const categories = [
  { name: "Pizzas", emoji: "🍕", color: "from-yellow-400 to-orange-500" },
  { name: "Hamburguesas", emoji: "🍔", color: "from-red-400 to-orange-500" },
  { name: "Sándwiches", emoji: "🥪", color: "from-orange-400 to-yellow-500" },
];

function RootRedirect() {
  const user = getAuthUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getRedirectPathByRole(user.rol)} replace />;
}

type FoodStoreLayoutProps = {
  children: ReactNode;
};

function FoodStoreLayout({ children }: FoodStoreLayoutProps) {
  const location = useLocation();
  const user = getAuthUser();

  const isStorePage = location.pathname === "/store";
  const isAdmin = user?.rol === "ADMIN";

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-orange-500 text-white shadow-md"
        : "bg-white text-gray-700 hover:bg-orange-100"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <header className="sticky top-0 z-50 border-b border-orange-200 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <NavLink
            to="/store"
            className="text-2xl font-extrabold text-orange-600"
          >
            🍔 FastFood Delivery
          </NavLink>

          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/store" className={navLinkClass}>
              Inicio
            </NavLink>

            <NavLink to="/store" className={navLinkClass}>
              Menú
            </NavLink>

            <NavLink to="/store" className={navLinkClass}>
              Ofertas
            </NavLink>

            <NavLink to="/store/cart" className={navLinkClass}>
              Carrito
            </NavLink>
            <NavLink to="/store/my-orders" className={navLinkClass}>
              Mis pedidos
            </NavLink>
            {isAdmin && (
              <>
                <NavLink to="/admin/categories" className={navLinkClass}>
                  Admin categorías
                </NavLink>

                <NavLink to="/admin/users" className={navLinkClass}>
                  Admin usuarios
                </NavLink>
                <NavLink to="/admin/products" className={navLinkClass}>
                  Admin productos
                </NavLink>
                <NavLink to="/admin/orders" className={navLinkClass}>
                  Admin pedidos
                </NavLink>
              </>
            )}

            <LogoutButton />
          </nav>
        </div>
      </header>

      {isStorePage && (
        <>
          <section className="mx-auto max-w-6xl px-4 py-10">
            <div className="rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 p-10 text-white shadow-xl">
              <h2 className="mb-3 text-4xl font-bold">
                Pedí lo que quieras, cuando quieras 🍕🍔🥪
              </h2>

              <p className="text-lg text-white/90">
                Las mejores pizzas, hamburguesas y sándwiches en minutos en tu
                casa.
              </p>

              <div className="mt-6 flex gap-3">
                <NavLink
                  to="/store"
                  className="rounded-xl bg-white px-5 py-2 font-semibold text-orange-600 transition hover:bg-gray-100"
                >
                  Ver menú
                </NavLink>

                <NavLink
                  to="/store"
                  className="rounded-xl bg-black/20 px-5 py-2 font-semibold transition hover:bg-black/30"
                >
                  Ofertas del día
                </NavLink>
              </div>
            </div>
          </section>

          <section className="mx-auto mb-10 grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className={
                  "cursor-pointer rounded-2xl bg-gradient-to-r " +
                  cat.color +
                  " p-6 text-white shadow-lg transition-transform hover:scale-105"
                }
              >
                <div className="mb-2 text-4xl">{cat.emoji}</div>

                <h3 className="text-xl font-bold">{cat.name}</h3>

                <p className="text-sm text-white/90">
                  Ver opciones deliciosas de {cat.name.toLowerCase()}
                </p>
              </div>
            ))}
          </section>
        </>
      )}

      <main className="mx-auto max-w-6xl px-4 pb-16">{children}</main>

      <footer className="mt-10 border-t border-orange-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FastFood Delivery — Hecho con 🍕
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        <Route
          path="/store"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "USUARIO"]}>
              <FoodStoreLayout>
                <StoreHomePage />
              </FoodStoreLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <FoodStoreLayout>
                <AdminCategoriesPage />
              </FoodStoreLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <FoodStoreLayout>
                <AdminUsersPage />
              </FoodStoreLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <FoodStoreLayout>
                <AdminProductsPage />
              </FoodStoreLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/product/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "USUARIO"]}>
              <FoodStoreLayout>
                <ProductDetailPage />
              </FoodStoreLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/cart"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "USUARIO"]}>
              <FoodStoreLayout>
                <CartPage />
              </FoodStoreLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/my-orders"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "USUARIO"]}>
              <FoodStoreLayout>
                <MyOrdersPage />
              </FoodStoreLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <FoodStoreLayout>
                <AdminOrdersPage />
              </FoodStoreLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
