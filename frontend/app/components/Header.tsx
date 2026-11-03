import { Link, NavLink } from "react-router";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <nav
        className="navbar navbar-expand-lg container-xl py-3"
        aria-label="Navegación principal"
      >
        <Link className="brand-lockup" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">B</span>
          <span>
            BETSPHERE<span className="brand-period">.</span>
            <small>SPORTS · LIVE · ODDS</small>
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir navegación"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <div className="navbar-nav mx-auto gap-lg-2">
            <NavLink className="nav-link" to="/">
              Deportes
            </NavLink>
            <NavLink className="nav-link" to="/matches">
              Partidos
            </NavLink>
            <NavLink className="nav-link" to="/history">
              Historial
            </NavLink>
          </div>
          <div className="d-flex gap-2 align-items-center py-2 py-lg-0">
            <Link
              className="btn btn-link text-decoration-none text-dark fw-semibold"
              to="/login"
            >
              Iniciar sesión
            </Link>
            <Link className="btn btn-brand" to="/register">
              Crear cuenta
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
