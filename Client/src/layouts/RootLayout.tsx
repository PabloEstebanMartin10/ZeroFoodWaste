import { Outlet, Link } from "react-router-dom";

export default function RootLayout() {
  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link> | <Link to="/about">Sobre nosotros</Link>
      </nav>
      <main className="content-container">
        <Outlet />
      </main>
    </div>
  );
}
