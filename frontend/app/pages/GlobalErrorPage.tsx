import { isRouteErrorResponse, Link, useRouteError } from "react-router";

export function GlobalErrorPage() {
  const error = useRouteError();
  const detail =
    isRouteErrorResponse(error) && error.statusText
      ? error.statusText
      : import.meta.env.DEV && error instanceof Error
        ? error.message
        : undefined;

  return (
    <main className="error-page container-fluid px-3 px-md-4" role="main">
      <section className="error-card row g-0" role="alert" aria-labelledby="error-title">
        <div className="col-lg-7 error-copy">
          <p className="eyebrow mb-3">Pausa técnica</p>
          <h1 className="page-title mb-3" id="error-title">
            No hemos podido cargar esta jugada.
          </h1>
          <p className="muted error-description">
            Ha ocurrido un problema inesperado. Puedes volver al inicio o
            probar de nuevo dentro de un momento.
          </p>
          {detail && <p className="error-detail">{detail}</p>}
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-brand" to="/">
              Volver al inicio <span aria-hidden="true">→</span>
            </Link>
            <button
              className="btn btn-outline-light error-retry"
              type="button"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        </div>
        <div className="col-lg-5 error-art" aria-hidden="true">
          <div className="error-ball error-ball--warning">!</div>
          <span className="error-orbit error-orbit--one" />
          <span className="error-orbit error-orbit--two" />
          <span className="error-art-caption">REVISANDO EL TERRENO</span>
        </div>
      </section>
    </main>
  );
}
