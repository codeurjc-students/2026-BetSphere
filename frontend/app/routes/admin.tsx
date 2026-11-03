export default function AdminPage() {
  return (
    <main className="container-xl py-5">
      <div className="eyebrow">Gestión de plataforma</div>
      <h1 className="page-title">Panel de administración</h1>
      <p className="muted">
        Vista de demostración para herramientas de gestión.
      </p>
      <div className="row g-3 mt-3">
        {[
          ["Usuarios", "1.284", "Gestionar usuarios"],
          ["Deportes", "8", "Gestionar deportes"],
          ["Competiciones", "32", "Gestionar competiciones"],
          ["Partidos", "146", "Gestionar partidos"],
        ].map(([title, count, action]) => (
          <div className="col-sm-6 col-xl-3" key={title}>
            <div className="stat-card">
              <span>{title}</span>
              <strong>{count}</strong>
              <button className="btn btn-outline-dark w-100 mt-3" disabled>
                {action} · Próximamente
              </button>
            </div>
          </div>
        ))}
      </div>
      <section className="surface-card mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="h5 fw-bold mb-0">Usuarios recientes</h2>
          <button className="btn btn-brand" disabled>
            Nuevo usuario
          </button>
        </div>
        <div className="table-responsive mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Lucía Romero", "lucia@example.com", "Activo"],
                ["Álvaro Martín", "alvaro@example.com", "Activo"],
                ["Sofía Torres", "sofia@example.com", "Revisión"],
              ].map((row) => (
                <tr key={row[1]}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted mb-0">
          Contenido de ejemplo · Las acciones de administración no están
          conectadas.
        </p>
      </section>
    </main>
  );
}
