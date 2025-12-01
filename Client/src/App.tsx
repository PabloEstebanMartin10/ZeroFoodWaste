import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { Home } from "./pages/home/Home";
import { ErrorPage } from "./pages/errorPage/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
