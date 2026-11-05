import { Link } from "react-router";
import type { Route } from "./+types/team";
import { getTeam } from "../services/team-service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) throw new Response("ID de equipo no válido", { status: 400 });
  return getTeam(id);
}

export default function TeamPage({ loaderData: team }: Route.ComponentProps) {
  return (
    <main className="container-xl py-5">
      <Link to="/matches" className="text-link">
        ← Volver
      </Link>
      <div className="surface-card mt-3">
        <div className="d-flex align-items-center gap-3">
          {team.logoUrl ? <img className="team-avatar" src={team.logoUrl} alt={`Logo de ${team.name}`} /> : <div className="team-avatar">{team.name.slice(0, 1)}</div>}
          <div>
            <div className="eyebrow">Equipo</div>
            <h1 className="page-title h2 mb-1">{team.name}</h1>
            <p className="muted mb-0">{team.country}</p>
          </div>
        </div>
      </div>
      <div className="section-heading">
        <h2 className="section-title">Rendimiento de temporada</h2>
      </div>
      <div className="row g-3">
        {[
          ["Partidos", team.totalMatches],
          ["Victorias", team.wins],
          ["Empates", team.draws],
          ["Derrotas", team.losses],
          ["Goles a favor", team.goalsFor],
          ["Goles en contra", team.goalsAgainst],
        ].map(([label, value]) => (
          <div className="col-6 col-md-4 col-lg-2" key={label}>
            <div className="stat-card">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
