import type { ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

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
  {
    name: "Descuentos",
    emoji: "🍔",
    subtitle:
      "Lunes: descuento 10% con MODO\nMiercoles: descuento 5% por compras superiores a $70.000\nViernes: descuento 10% con Tarjeta Visa de todos los bancos",
  },
  {
    name: "Sucursales",
    emoji: "📍",
    subtitle: "Encontrá la Food Store más cercana y retirá tu pedido",
  },
];

const sucursales = [
  { nombre: "Food Store Centro", direccion: "Av. San Martín 1250, Córdoba" },
  { nombre: "Food Store Norte", direccion: "Bv. Chacabuco 890, Córdoba" },
  { nombre: "Food Store Sur", direccion: "Av. Vélez Sarsfield 2100, Córdoba" },
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
        : "bg-orange-50 text-orange-800 hover:bg-orange-100"
    }`;

  const carouselImages = [
    { src: 'https://ik.imagekit.io/rooxjlwlq/b2d8905d-5ab3-47bb-b867-e707151dd245.jpeg', alt: 'Postre Rogel' },
    { src: 'https://ik.imagekit.io/rooxjlwlq/unnamed%20(3).jpg', alt: 'Milanesa food store' },
    { src: 'https://ik.imagekit.io/rooxjlwlq/unnamed%20(4).jpg', alt: 'Pizza con huevo' },
    { src: 'https://ik.imagekit.io/rooxjlwlq/426c0bae-b428-4e11-9d43-13b19a8d0e53.jpeg', alt: 'Triple de pollo' },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <header className="sticky top-0 z-50 border-b border-orange-200 bg-white/70 backdrop-blur-md">
        <div className="w-[70%] mx-auto flex items-center justify-between px-4 py-3">
          <NavLink
            to="/store"
            className="flex items-center gap-3"
          >
            <img
              src="https://ik.imagekit.io/rooxjlwlq/logo%20Food%20Store.png?updatedAt=1777731567524"
              alt="Food Store Logo"
              className="h-35 w-auto"
            />
          </NavLink>

          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/store" className={navLinkClass}>
              Inicio
            </NavLink>

            {!isAdmin && (
              <button
                type="button"
                onClick={scrollToMenu}
                className="rounded-xl bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800 transition hover:bg-orange-100"
              >
                Menú
              </button>
            )}

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
          <section className="w-[70%] mx-auto px-4 py-10">
            <div className="relative h-[44rem] overflow-hidden rounded-3xl shadow-xl">
              {carouselImages.map((image, index) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                ›
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="w-[70%] mx-auto mb-10 grid grid-cols-1 gap-6 px-4 md:grid-cols-2">
            {categories.map((cat) => {
              const renderSubtitle = (text: string) => {
                if (cat.name !== 'Descuentos') return text;
                const days = ['Lunes', 'Miercoles', 'Viernes'];
                const parts = text.split(new RegExp(`(${days.join('|')})`));
                return parts.map((part, idx) => 
                  days.includes(part) ? <span key={idx} className="text-orange-300 font-bold text-stroke">{part}</span> : part
                );
              };

              const cardClassName =
                "rounded-3xl bg-gradient-to-r from-orange-200 to-red-300 border-4 border-orange-500 p-6 shadow-xl text-left";

              return (
                <article key={cat.name} className={cardClassName}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-4xl">{cat.emoji}</div>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                      Top
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-stroke text-orange-300">{cat.name}</h3>

                  {cat.name === 'Sucursales' ? (
                    <div className="mt-4 space-y-3">
                      <p className="text-lg font-bold leading-tight text-white">
                        {cat.subtitle}
                      </p>
                      {sucursales.map((sucursal) => (
                        <div
                          key={sucursal.nombre}
                          className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm"
                        >
                          <p className="text-base font-bold text-orange-200">{sucursal.nombre}</p>
                          <p className="mt-1 text-sm font-medium text-white/90">{sucursal.direccion}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 whitespace-pre-line text-lg font-bold leading-tight text-white">
                      {renderSubtitle(cat.subtitle)}
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        </>
      )}

      <main className="w-[70%] mx-auto px-4 pb-16">{children}</main>

      <footer className="mt-10 border-t border-orange-200 bg-white py-6">
        <div className="w-[70%] mx-auto px-4 text-center text-sm text-gray-500">
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
