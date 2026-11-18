import { Link } from "react-router";
import type { Route } from "./+types/team";
import { getTeam } from "../services/team-service";
import { getCompetitions } from "../services/competition-service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) throw new Response("Invalid team id", { status: 400 });
  const [team, competitions] = await Promise.all([getTeam(id), getCompetitions()]);
  const competition = competitions.find((row) => row.teams.some((entry) => entry.id === id));
  return { team, competition };
}

export default function TeamPage({ loaderData: data }: Route.ComponentProps) {
  const { team, competition } = data;
  return (
    <main className="container-xl arena-page">
      <Link to={competition ? `/competition/${competition.id}` : "/"} className="back-link">{competition?.name ?? "Sports"}</Link>
      <div className="arena-hero club-hero mt-3">
        <div className="d-flex align-items-center gap-3">
          {team.logoUrl ? <img className="team-avatar" src={team.logoUrl} alt={`${team.name} logo`} /> : <div className="team-avatar">{team.name.slice(0, 1)}</div>}
          <div>
            <div className="eyebrow">Team</div>
            <h1 className="page-title h2 mb-1">{team.name}</h1>
            <p className="muted mb-0">{team.country}</p>
          </div>
        </div>
      </div>
      <div className="section-heading">
        <h2 className="section-title">Season performance</h2>
      </div>
      <section className="season-dashboard">
        <div className="season-summary">
          <strong>{team.totalMatches}</strong>
          <span>Matches played</span>
          <meter min={0} max={Math.max(team.totalMatches, 1)} value={team.wins} aria-label="Wins this season" />
        </div>
        <div className="season-stats">
        {[
          ["Wins", team.wins],
          ["Draws", team.draws],
          ["Losses", team.losses],
          ["Goals for", team.goalsFor],
          ["Goals against", team.goalsAgainst],
        ].map(([label, value]) => (
          <div className="season-stat" key={label}>
            <div className="stat-card">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
        </div>
      </section>
    </main>
  );
}
