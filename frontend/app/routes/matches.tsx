import type { Route } from "./+types/matches";
import { getMatches } from "../services/match-service";
import { Link } from "react-router";

export async function clientLoader() {
  const matches = await getMatches();
  return matches;
}

export default function MatchList({ loaderData }: Route.ComponentProps) {
  const matches = loaderData;
  return (
    <main className="container-xl py-5">
      <div className="eyebrow">Calendario</div>
      <h1 className="page-title">Partidos</h1>
      <p className="muted mb-4">Toda la acción, en un solo lugar.</p>
      {matches.length ? (
        matches.map((match) => (
          <Link className="match-row" to={`/match/${match.id}`} key={match.id}>
            <div>
              <div className="match-teams">
                {match.homeTeamLogoUrl && <img className="entity-logo me-2" src={match.homeTeamLogoUrl} alt="" />}
                {match.homeTeam} <span className="muted">vs</span>{" "}
                {match.awayTeamLogoUrl && <img className="entity-logo me-2" src={match.awayTeamLogoUrl} alt="" />}
                {match.awayTeam}
              </div>
              <div className="match-meta">
                {new Date(match.matchDate).toLocaleString("es-ES")}
              </div>
            </div>
            <div className="text-end">
              <div className="match-status">{match.gameStatus}</div>
              <span className="small muted">Ver partido →</span>
            </div>
          </Link>
        ))
      ) : (
        <div className="surface-card muted">No hay partidos disponibles.</div>
      )}
    </main>
  );
}
