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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "registro", element: <Register /> },
      { path: "comercio", element: <DashboardComercio /> },
      { path: "banco", element: <DashboardBanco /> },
      { path: "perfil-comercio", element: <ProfileComercio /> },
      { path: "perfil-banco", element: <ProfileBanco /> },
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
