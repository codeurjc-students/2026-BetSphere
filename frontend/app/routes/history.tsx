export default function HistoryPage() {
  return (
    <main className="container-xl py-5">
      <div className="eyebrow">Tu actividad</div>
      <h1 className="page-title">Historial</h1>
      <p className="muted">
        Resumen de ingresos y resultados · Datos de demostración
      </p>
      <div className="row g-3 mt-3">
        <div className="col-md-4">
          <div className="stat-card">
            <span>Balance neto</span>
            <strong>+84,20 €</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <span>Ingresos</span>
            <strong>250,00 €</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <span>Actividad</span>
            <strong>18</strong>
            <span>apuestas de ejemplo</span>
          </div>
        </div>
      </div>
      <section className="surface-card mt-4">
        <div className="d-flex justify-content-between">
          <h2 className="h5 fw-bold">Balance en el tiempo</h2>
          <span className="badge text-bg-light">Últimos 30 días</span>
        </div>
        <div
          className="chart-placeholder mt-3"
          aria-label="Gráfico ilustrativo"
        >
          {[
            28, 42, 36, 58, 49, 72, 63, 88, 76, 95, 81, 100, 91, 110, 97, 120,
          ].map((h, i) => (
            <span key={i} style={{ height: `${h}px` }} />
          ))}
        </div>
        <p className="small muted mt-3 mb-0">
          Gráfico ilustrativo; el historial real se conectará más adelante.
        </p>
      </section>
      <section className="surface-card mt-4">
        <h2 className="h5 fw-bold">Actividad reciente</h2>
        <p className="muted mb-0">
          Todavía no hay movimientos reales que mostrar.
        </p>
      </section>
    </main>
  );
}
