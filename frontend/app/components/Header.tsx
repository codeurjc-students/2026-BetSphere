import { Link, NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { logout } from "../services/auth-service";
import { useAuthStore } from "../stores/auth-store";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const initials = user?.username.slice(0, 1).toLocaleUpperCase("en-US");

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearSession();
      setOpen(false);
      navigate("/");
    }
  }

  return (
    <header className="site-header">
      <nav
        className="navbar navbar-expand-lg container-xl py-3"
        aria-label="Main navigation"
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
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <div className="navbar-nav mx-auto gap-lg-2">
            <NavLink className="nav-link" to="/">
              Sports
            </NavLink>
            <NavLink className="nav-link" to="/matches">
              Matches
            </NavLink>
            <NavLink className="nav-link" to="/history">
              History
            </NavLink>
            {user?.roles.includes("ROLE_ADMIN") && (
              <NavLink
                className="nav-link"
                to="/admin"
                onClick={() => setOpen(false)}
              >
                Admin Panel
              </NavLink>
            )}
          </div>
          <div className="header-account d-flex gap-3 align-items-center py-2 py-lg-0">
            {user ? (
              <>
                <span className="header-greeting">Hello, <strong>{user.username}</strong></span>
                <Link
                  className="header-avatar-link"
                  to="/profile"
                  onClick={() => setOpen(false)}
                  aria-label={`View profile of ${user.email}`}
                  title="My profile"
                >
                  <span className="header-avatar" aria-hidden="true">
                    {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : initials}
                  </span>
                </Link>
                <button className="header-logout" type="button" onClick={handleLogout}>
                    Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-link text-decoration-none text-dark fw-semibold"
                  to="/login"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link className="btn btn-brand" to="/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
