import type { Route } from "./+types/competitions";
import { Link } from "react-router";
import { getById } from "../services/competition-service";
import FixtureExplorer from "../components/FixtureExplorer";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Response("Invalid competition id", { status: 400 });
  }
  return getById(id);
}

export default function CompetitionPage({
  loaderData: competition,
}: Route.ComponentProps) {
  return (
    <main className="container-xl arena-page">
      <Link className="back-link" to={`/sport/${competition.sport.id}`}>{competition.sport.name}</Link>
      <header className="arena-hero competition-hero mt-3">
        {competition.iconUrl && <img className="competition-emblem" src={competition.iconUrl} alt="" />}
        <div>
          <div className="eyebrow">{competition.sport.name} · {competition.country}</div>
          <h1 className="page-title">{competition.name}</h1>
          <p>{competition.teams.length} teams · {competition.matches.length} matches</p>
        </div>
      </header>

      <section className="competition-board">
        <div>
          <h2 className="section-title mb-3">Schedule</h2>
          <FixtureExplorer key={competition.id} matches={competition.matches} initialFilter="Upcoming" />
        </div>
        <aside>
          <h2 className="section-title mb-3">Teams</h2>
          {competition.teams.length === 0 ? (
            <p className="muted">No registered teams.</p>
          ) : (
            <div className="club-grid">
              {competition.teams.map((team) => (
                <div className="club-tile" key={team.id}>
                  <Link className="team-link" to={`/team/${team.id}`}>
                    <span>
                      {team.logoUrl && <img className="entity-logo me-2" src={team.logoUrl} alt="" />}
                      <strong>{team.name}</strong>
                      <span className="d-block small muted">{team.country}</span>
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
