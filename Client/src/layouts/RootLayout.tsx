import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function RootLayout() {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
}
