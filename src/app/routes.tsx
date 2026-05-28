import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelect from "./pages/RoleSelect";
import ClientDashboard from "./pages/ClientDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
<<<<<<< HEAD
import { ProtectedRoute } from "./components/ProtectedRoute"; // 👈 Исправили путь на одну точку!
=======
import { ProtectedRoute } from "./components/ProtectedRoute";

// 👇 Исправленный путь (две точки в начале)
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
import { KBJUPage } from '../modules/kbju/pages/KBJUPage';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/role-select",
    Component: RoleSelect,
  },
<<<<<<< HEAD
=======
  // 👇 Добавили твой маршрут сюда!
  {
    path: "/kbju",
    Component: KBJUPage,
  },
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
  {
    path: "/client",
    element: (
      <ProtectedRoute requiredRole="client">
        <ClientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/trainer",
    element: (
      <ProtectedRoute requiredRole="trainer">
        <TrainerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
<<<<<<< HEAD
]);
=======
]);
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14
