import type { Route } from "./+types/competitions";
import { Link } from "react-router";
import { getById } from "../services/competition-service";
import { formatDateTime } from "../services/format-date";

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
  const upcomingMatches = competition.matches.filter(
    (match) =>
      new Date(match.matchDate).getTime() >= Date.now() &&
      match.gameStatus !== "FINISHED",
  );

  return (
    <main className="container-xl py-5 page-enter">
      <Link className="back-link" to={`/sport/${competition.sport.id}`}>← {competition.sport.name}</Link>
      <div className="eyebrow">
        {competition.sport.name} · {competition.country}
      </div>
      <section className="competition-hero mt-3">
        <div className="eyebrow mb-2">Competition</div>
        {competition.iconUrl && <img className="entity-logo mb-2" src={competition.iconUrl} alt={`${competition.name} logo`} />}
        <h1 className="page-title">{competition.name}</h1>
        <p className="muted mb-0">
          {competition.teams.length} teams · {competition.matches.length}{" "}
          matches
        </p>
      </section>

      <div className="section-heading">
        <div>
          <div className="eyebrow mb-2">Participants</div>
          <h2 className="section-title mb-0">Teams</h2>
        </div>
      </div>
      {competition.teams.length === 0 ? (
        <p className="muted">No registered teams.</p>
      ) : (
        <div className="row g-3">
          {competition.teams.map((team) => (
            <div className="col-12 col-sm-6 col-lg-4" key={team.id}>
              <Link className="team-link" to={`/team/${team.id}`}>
                <span>
                  {team.logoUrl && <img className="entity-logo me-2" src={team.logoUrl} alt="" />}
                  <strong>{team.name}</strong>
                  <span className="d-block small muted">{team.country}</span>
                </span>
                <span className="text-link" aria-hidden="true">
                  View team
                </span>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="section-heading">
        <div>
          <div className="eyebrow mb-2">Upcoming</div>
          <h2 className="section-title mb-0">Upcoming matches</h2>
        </div>
      </div>
      {upcomingMatches.length === 0 ? (
        <p className="muted">No upcoming matches.</p>
      ) : (
        upcomingMatches.map((match) => (
          <Link className="match-row" to={`/match/${match.id}`} key={match.id}>
            <span>
              {match.homeTeamLogoUrl && <img className="entity-logo me-2" src={match.homeTeamLogoUrl} alt="" />}
              <span className="match-teams">
                {match.homeTeam} <span className="muted">vs</span>{" "}
                {match.awayTeamLogoUrl && <img className="entity-logo me-2" src={match.awayTeamLogoUrl} alt="" />}
                {match.awayTeam}
              </span>
              <span className="match-meta d-block">
                {formatDateTime(match.matchDate)}
              </span>
            </span>
            <span className="match-status">{match.gameStatus} →</span>
          </Link>
        ))
      )}

      <div className="section-heading">
        <div>
          <div className="eyebrow mb-2">Full schedule</div>
          <h2 className="section-title mb-0">All matches</h2>
        </div>
      </div>
      {competition.matches.length === 0 ? (
        <p className="muted">No matches available.</p>
      ) : (
        competition.matches.map((match) => (
          <Link className="match-row" to={`/match/${match.id}`} key={match.id}>
            <span>
              {match.homeTeamLogoUrl && <img className="entity-logo me-2" src={match.homeTeamLogoUrl} alt="" />}
              <span className="match-teams">
                {match.homeTeam} <span className="muted">vs</span>{" "}
                {match.awayTeamLogoUrl && <img className="entity-logo me-2" src={match.awayTeamLogoUrl} alt="" />}
                {match.awayTeam}
              </span>
              <span className="match-meta d-block">
                {formatDateTime(match.matchDate)}
              </span>
            </span>
            <span className="match-status">{match.gameStatus} →</span>
          </Link>
        ))
      )}
    </main>
  );
}
