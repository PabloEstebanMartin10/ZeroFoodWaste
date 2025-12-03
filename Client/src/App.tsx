import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { Home } from "./pages/home/Home";
import { ErrorPage } from "./pages/errorPage/ErrorPage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import DashboardComercio from "./pages/dashboardComercio/DashboardComercio";
import DashboardBanco from "./pages/dashboardBanco/DashboardBanco";
import ProfileComercio from "./pages/profileComercio/ProfileComercio";

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
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
