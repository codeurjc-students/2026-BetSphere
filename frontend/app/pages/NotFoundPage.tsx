import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="error-page container-fluid px-3 px-md-4" role="main">
      <section className="error-card row g-0" aria-labelledby="error-title">
        <div className="col-lg-7 error-copy">
          <p className="eyebrow mb-3">Fuera de juego · 404</p>
          <h1 className="page-title mb-3" id="error-title">
            Esta página no está en el marcador.
          </h1>
          <p className="muted error-description">
            Puede que el enlace haya cambiado o que la dirección no exista.
            Vuelve al inicio y sigue explorando BetSphere.
          </p>
          <Link className="btn btn-brand" to="/">
            Volver al inicio <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="col-lg-5 error-art" aria-hidden="true">
          <div className="error-ball">404</div>
          <span className="error-orbit error-orbit--one" />
          <span className="error-orbit error-orbit--two" />
        </div>
      </section>
    </main>
  );
}
