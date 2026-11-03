import { Link, useParams } from "react-router";
export default function TeamPage() {
  const { id } = useParams();
  return (
    <main className="container-xl py-5">
      <Link to="/matches" className="text-link">
        ← Volver
      </Link>
      <div className="surface-card mt-3">
        <div className="d-flex align-items-center gap-3">
          <div className="team-avatar">R</div>
          <div>
            <div className="eyebrow">Equipo · ficha de demostración</div>
            <h1 className="page-title h2 mb-1">Real Madrid</h1>
            <p className="muted mb-0">Madrid, España</p>
          </div>
        </div>
      </div>
      <div className="section-heading">
        <h2 className="section-title">Rendimiento de temporada</h2>
      </div>
      <div className="row g-3">
        {[
          ["Partidos", 28],
          ["Victorias", 20],
          ["Empates", 5],
          ["Derrotas", 3],
          ["Goles a favor", 61],
          ["Goles en contra", 24],
        ].map(([label, value]) => (
          <div className="col-6 col-md-4 col-lg-2" key={label}>
            <div className="stat-card">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="small muted mt-3">Vista de ejemplo · ID {id}</p>
    </main>
  );
}
