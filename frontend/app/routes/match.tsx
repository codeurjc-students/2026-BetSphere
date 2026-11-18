import { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router";
import type { Route } from "./+types/match";
import type { MatchViewDTO } from "../dtos/MatchViewDTO";
import { getMatchById } from "../services/match-service";
import { optionalUser } from "../services/auth-guards";
import { formatDateTime } from "../services/format-date";
import { formatOdds } from "../services/format-odds";
import { rememberMatch } from "../services/recent-matches";

const matchTools = {
  chat: { label: "Match chat", feature: "Match chat", symbol: "◌" },
  bet: { label: "Place a bet", feature: "Virtual betting", symbol: "◇" },
  ai: { label: "Generate AI analysis", feature: "AI analysis", symbol: "✦" },
} as const;

function MatchTools({ signedIn, loginHref }: { signedIn: boolean; loginHref: string }) {
  const [selected, setSelected] = useState<keyof typeof matchTools>("chat");
  const tool = matchTools[selected];
  return (
    <section className="match-tools" aria-labelledby="match-tools-title">
      <h2 id="match-tools-title" className="section-title">Match room</h2>
      <div className="match-tool-options" role="group" aria-label="Match tools">
        {(Object.keys(matchTools) as (keyof typeof matchTools)[]).map((key) => (
          <button type="button" key={key} aria-pressed={selected === key} onClick={() => setSelected(key)}>
            <span aria-hidden="true">{matchTools[key].symbol}</span>{matchTools[key].label}
          </button>
        ))}
      </div>
      <div className="match-tool-content">
        <p aria-live="polite">{signedIn ? `${tool.feature} will be available later.` : `Sign in to access ${tool.feature.toLowerCase()}.`}</p>
        {!signedIn && <Link className="btn btn-brand" to={loginHref}>Sign In</Link>}
      </div>
    </section>
  );
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0)
    throw new Response("Invalid match id", { status: 400 });

  const [match, user] = await Promise.all([
    getMatchById(id),
    optionalUser(),
  ]);
  return { match, user };
}

const seasonMetrics = [
  ["Matches", "totalMatches"], ["Wins", "wins"], ["Draws", "draws"],
  ["Losses", "losses"], ["Goals for", "goalsFor"], ["Goals against", "goalsAgainst"],
] as const;

function SeasonStats({ homeTeam, awayTeam }: Pick<MatchViewDTO, "homeTeam" | "awayTeam">) {
  return (
    <table className="table season-table">
      <thead><tr><th scope="col">Metric</th><th scope="col">{homeTeam.name}</th><th scope="col">{awayTeam.name}</th></tr></thead>
      <tbody>
        {seasonMetrics.map(([label, key]) => (
          <tr key={key}><th scope="row">{label}</th><td>{homeTeam[key]}</td><td>{awayTeam[key]}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

export default function MatchPage({ loaderData }: Route.ComponentProps) {
  const { match, user } = loaderData;
  const userId = user?.id;
  useEffect(() => {
    if (userId !== undefined) rememberMatch(userId, match);
  }, [userId, match]);
  const [metric, setMetric] = useState<"wins" | "goalsFor" | "goalsAgainst">("wins");
  const maximum = Math.max(match.homeTeam[metric], match.awayTeam[metric], 1);
  const loginHref = `/login?returnTo=${encodeURIComponent(`/match/${match.id}`)}`;
  const odds = [
    { label: "1", name: match.homeTeam.name, value: match.homeOdds },
    { label: "X", name: "Draw", value: match.drawOdds },
    { label: "2", name: match.awayTeam.name, value: match.awayOdds },
  ];

  return (
    <Container as="main" className="arena-page match-centre">
      <Link className="back-link" to={`/competition/${match.competition.id}`}>
        {match.competition.name}
      </Link>
      <section className="arena-hero match-hero my-3">
        <div className="eyebrow">
          {match.competition.sport.iconUrl && <img className="entity-logo me-2" src={match.competition.sport.iconUrl} alt="" />}
          {match.competition.iconUrl && <img className="entity-logo me-2" src={match.competition.iconUrl} alt="" />}
          {match.competition.name} · {match.competition.sport.name}
        </div>
        <div className="match-header-meta mt-3">
          <time dateTime={match.matchDate}>{formatDateTime(match.matchDate)}</time>
          <Badge bg="dark" className="status-badge">
            {match.gameStatus}
          </Badge>
        </div>
        <h1 className="visually-hidden">{match.homeTeam.name} vs {match.awayTeam.name}</h1>
        <Row className="align-items-center text-center mt-4 gy-3">
          <Col xs={5}>
            <Link className="match-team-link" to={`/team/${match.homeTeam.id}`}>
              {match.homeTeam.logoUrl && <img className="match-team-logo mb-2" src={match.homeTeam.logoUrl} alt="" />}
              <span className="match-team-title">{match.homeTeam.name}</span>
            </Link>
          </Col>
          <Col xs={2}>
            <strong
              className="match-score-display"
              aria-label="Versus"
            >
              VS
            </strong>
          </Col>
          <Col xs={5}>
            <Link className="match-team-link" to={`/team/${match.awayTeam.id}`}>
              {match.awayTeam.logoUrl && <img className="match-team-logo mb-2" src={match.awayTeam.logoUrl} alt="" />}
              <span className="match-team-title">{match.awayTeam.name}</span>
            </Link>
          </Col>
        </Row>
      </section>

      <Row className="g-4 match-dashboard">
        <Col lg={8}>
          <section className="surface-card mb-4" aria-labelledby="odds-title">
            <div className="section-heading mt-0">
              <h2 id="odds-title" className="section-title mb-0">Full Time Result · 1X2</h2>
              <span className="muted small">Reference odds</span>
            </div>
            <Row className="g-2">
              {odds.map((odd) => (
                <Col xs={4} key={odd.label}>
                  <Button className="match-odd-button w-100" disabled aria-label={`Odds ${odd.label} disabled`}>
                    <span className="small muted">{odd.label} · {odd.name}</span>
                    <span className="fs-4 fw-bold">{formatOdds(odd.value)}</span>
                  </Button>
                </Col>
              ))}
            </Row>
          </section>
          <section className="comparison-panel">
            <h2 className="section-title">Team comparison</h2>
            <div className="segmented" role="group" aria-label="Comparison metric">
              <button type="button" aria-pressed={metric === "wins"} onClick={() => setMetric("wins")}>Wins</button>
              <button type="button" aria-pressed={metric === "goalsFor"} onClick={() => setMetric("goalsFor")}>Goals for</button>
              <button type="button" aria-pressed={metric === "goalsAgainst"} onClick={() => setMetric("goalsAgainst")}>Goals against</button>
            </div>
            <div aria-live="polite">
              {[match.homeTeam, match.awayTeam].map((team) => (
                <div className="comparison-row" key={team.id}>
                  <span>{team.name}</span><strong>{team[metric]}</strong>
                  <progress aria-label={team.name} max={maximum} value={team[metric]} />
                </div>
              ))}
            </div>
          </section>
          <details className="data-disclosure">
            <summary>Full season statistics</summary>
            <SeasonStats homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
          </details>
        </Col>
        <Col lg={4}>
          <MatchTools key={match.id} signedIn={Boolean(user)} loginHref={loginHref} />
          <aside className="fixture-context">
            <h2 className="section-title">Match info</h2>
            <dl>
              <dt>Competition</dt><dd>{match.competition.name}</dd>
              <dt>Sport</dt><dd>{match.competition.sport.name}</dd>
              <dt>Scheduled time</dt><dd>{formatDateTime(match.matchDate)}</dd>
            </dl>
            <Link className="text-link" to="/matches">Browse schedule</Link>
          </aside>
        </Col>
      </Row>
    </Container>
  );
}
