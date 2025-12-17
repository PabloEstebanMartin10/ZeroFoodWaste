import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { Home } from "./pages/home/Home";
import { ErrorPage } from "./pages/errorPage/ErrorPage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import DashboardComercio from "./pages/dashboardComercio/DashboardComercio";
import DashboardBanco from "./pages/dashboardBanco/DashboardBanco";
import { AuthProvider } from "./context/AuthProvider";
import ProfileComercio from "./pages/profileComercio/ProfileComercio";
import ProfileBanco from "./pages/profileBanco/ProfileBanco";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "registro", element: <Register /> },
      {
        element: <ProtectedRoute allowedRoles={["Establishment"]} />,
        children: [
          { path: "comercio", element: <DashboardComercio /> },
          { path: "perfil-comercio", element: <ProfileComercio /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["FoodBank"]} />,
        children: [
          { path: "banco", element: <DashboardBanco /> },
          { path: "perfil-banco", element: <ProfileBanco /> },
          { path: "visita-comercio/:id", element: <ProfileComercio /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
