import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="site-footer mt-auto">
      <div className="container-xl py-5">
        <div className="row g-4 align-items-start">
          <div className="col-md-6">
            <Link className="brand-lockup text-white" to="/">
              <span className="brand-mark">B</span>
              <span>
                BETSPHERE<span className="brand-period">.</span>
                <small>SPORTS · LIVE · ODDS</small>
              </span>
            </Link>
            <p className="footer-copy mt-3">
              Cada partido cuenta. Sigue el juego, entiende las cuotas y
              disfruta del deporte.
            </p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="footer-title">Explorar</h2>
            <Link to="/">Deportes</Link>
            <Link to="/matches">Partidos</Link>
            <Link to="/history">Historial</Link>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="footer-title">Tu cuenta</h2>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Crear cuenta</Link>
            <Link to="/profile">Perfil</Link>
          </div>
        </div>
        <div className="footer-bottom mt-5 pt-3">
          © 2026 BetSphere{" "}
          <span>Juega con responsabilidad · Solo mayores de 18 años</span>
        </div>
      </div>
    </footer>
  );
}
