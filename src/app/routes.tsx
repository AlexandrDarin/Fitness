import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelect from "./pages/RoleSelect";
import ClientDashboard from "./pages/ClientDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
  {
    path: "/kbju",
    Component: KBJUPage,
  },
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
]);