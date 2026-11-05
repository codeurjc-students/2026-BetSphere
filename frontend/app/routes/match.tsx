import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router";
import type { Route } from "./+types/match";
import type { MatchViewDTO } from "../dtos/MatchViewDTO";
import { getMatchById } from "../services/match-service";
import { optionalUser } from "../services/auth-guards";
import { formatDateTime } from "../services/format-date";

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

function TeamStats({
  name,
  team,
}: {
  name: string;
  team: MatchViewDTO["homeTeam"];
}) {
  return (
    <Card className="stats-card h-100">
      <Card.Body>
        <h3 className="h5 fw-bold">{name}</h3>
        <p className="muted small">{team.country}</p>
        <>
          <dl className="row mb-0">
            <dt className="col-8">Partidos</dt>
            <dd className="col-4">{team.totalMatches}</dd>
            <dt className="col-8">Victorias</dt>
            <dd className="col-4">{team.wins}</dd>
            <dt className="col-8">Empates</dt>
            <dd className="col-4">{team.draws}</dd>
            <dt className="col-8">Derrotas</dt>
            <dd className="col-4">{team.losses}</dd>
            <dt className="col-8">Goles a favor</dt>
            <dd className="col-4">{team.goalsFor}</dd>
            <dt className="col-8">Goles en contra</dt>
            <dd className="col-4">{team.goalsAgainst}</dd>
          </dl>
        </>
      </Card.Body>
    </Card>
  );
}

export default function MatchPage({ loaderData }: Route.ComponentProps) {
  const { match, user } = loaderData;
  const loginHref = `/login?returnTo=${encodeURIComponent(`/match/${match.id}`)}`;
  const odds = [
    { label: "1", name: match.homeTeam.name, value: match.homeOdds },
    { label: "X", name: "Empate", value: match.drawOdds },
    { label: "2", name: match.awayTeam.name, value: match.awayOdds },
  ];

  return (
    <Container as="main" className="py-5 page-enter">
      <Link className="back-link" to={`/competition/${match.competition.id}`}>
        ← {match.competition.name}
      </Link>
      <section className="match-hero my-3">
        <div className="eyebrow">
          {match.competition.sport.iconUrl && <img className="entity-logo me-2" src={match.competition.sport.iconUrl} alt="" />}
          {match.competition.iconUrl && <img className="entity-logo me-2" src={match.competition.iconUrl} alt="" />}
          {match.competition.name} · {match.competition.sport.name}
        </div>
        <div className="match-header-meta mt-3">
        <span>{formatDateTime(match.matchDate)}</span>
          <Badge bg="dark" className="status-badge">
            {match.gameStatus}
          </Badge>
        </div>
        <Row className="align-items-center text-center mt-4 gy-3">
          <Col xs={5}>
            {match.homeTeam.logoUrl && <img className="match-team-logo mb-2" src={match.homeTeam.logoUrl} alt={`Logo de ${match.homeTeam.name}`} />}
            <h1 className="match-team-title">{match.homeTeam.name}</h1>
          </Col>
          <Col xs={2}>
            <strong
              className="match-score-display"
              aria-label="Score unavailable"
            >
              —:—
            </strong>
          </Col>
          <Col xs={5}>
            {match.awayTeam.logoUrl && <img className="match-team-logo mb-2" src={match.awayTeam.logoUrl} alt={`Logo de ${match.awayTeam.name}`} />}
            <h1 className="match-team-title">{match.awayTeam.name}</h1>
          </Col>
        </Row>
      </section>

      <Row className="g-4">
        <Col lg={8}>
          <section className="surface-card mb-4">
            <div className="section-heading mt-0">
              <div>
                <div className="eyebrow mb-2">Mercado principal</div>
                <h2 className="section-title mb-0">Resultado · 1X2</h2>
              </div>
              <span className="muted small">Solo visual · no disponible</span>
            </div>
            <Row className="g-2">
              {odds.map((odd) => (
                <Col xs={4} key={odd.label}>
                  <Button
                    className="match-odd-button w-100"
                    disabled
                    aria-label={`Odds ${odd.label} disabled`}
                  >
                    <span className="small muted">
                      {odd.label} · {odd.name}
                    </span>
                    <span className="fs-4 fw-bold">
                      {odd.value == null ? "—" : odd.value.toFixed(2)}
                    </span>
                  </Button>
                </Col>
              ))}
            </Row>
          </section>
          <div className="section-heading mt-0">
            <div>
              <div className="eyebrow mb-2">Forma de temporada</div>
              <h2 className="section-title mb-0">
                Estadísticas de los equipos
              </h2>
            </div>
          </div>
          <Row className="g-3">
            <Col md={6}>
              <TeamStats name={match.homeTeam.name} team={match.homeTeam} />
            </Col>
            <Col md={6}>
              <TeamStats name={match.awayTeam.name} team={match.awayTeam} />
            </Col>
          </Row>
        </Col>
        <Col lg={4}>
          <Card className="stats-card mb-3">
            <Card.Body>
              <div className="eyebrow mb-2">Comunidad</div>
              <h2 className="h5 fw-bold">Chat en directo</h2>
              {user ? (
                <p className="muted mb-0">
                  La conversación del partido estará disponible próximamente.
                </p>
              ) : (
                <>
                  <p className="muted">Inicia sesión para participar en el chat.</p>
                  <Link className="btn btn-outline-dark w-100" to={loginHref}>
                    Iniciar sesión
                  </Link>
                </>
              )}
            </Card.Body>
          </Card>
          <Card className="stats-card">
            <Card.Body>
              <div className="eyebrow mb-2">Tu siguiente paso</div>
              <h2 className="h5 fw-bold">Acciones del partido</h2>
              {user ? (
                <>
                  <Button className="btn-brand w-100 mb-2" disabled>
                    Iniciar apuesta · Próximamente
                  </Button>
                  <Button className="btn-outline-light w-100" disabled>
                    Generar predicción con IA · Próximamente
                  </Button>
                </>
              ) : (
                <>
                  <p className="muted">Inicia sesión para apostar o generar un resumen con IA.</p>
                  <Link className="btn btn-brand w-100" to={loginHref}>
                    Iniciar sesión
                  </Link>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
