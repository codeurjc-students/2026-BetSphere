import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router";
import type { Route } from "./+types/match";
import type { MatchViewDTO } from "../dtos/MatchViewDTO";
import { getMatchById } from "../services/match-service";

export async function clientLoader({ params }: Route.ClientLoaderArgs): Promise<MatchViewDTO> {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) throw new Response("Not valid match ID", { status: 400 });

    return getMatchById(id);
}

function formatDate(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("es-ES");
}

function TeamStats({ name, team }: { name: string; team: MatchViewDTO["homeTeam"] }) {
    return (
        <Card className="h-100">
            <Card.Body>
                <h3 className="h5">{name}</h3>
                {team ? <>
                    <p>{team.country}</p>
                    <dl className="row mb-0">
                        <dt className="col-8">Partidos</dt><dd className="col-4">{team.totalMatches}</dd>
                        <dt className="col-8">Victorias</dt><dd className="col-4">{team.wins}</dd>
                        <dt className="col-8">Empates</dt><dd className="col-4">{team.draws}</dd>
                        <dt className="col-8">Derrotas</dt><dd className="col-4">{team.losses}</dd>
                        <dt className="col-8">Goles a favor</dt><dd className="col-4">{team.goalsFor}</dd>
                        <dt className="col-8">Goles en contra</dt><dd className="col-4">{team.goalsAgainst}</dd>
                    </dl>
                </> : <p>Estadísticas del equipo no disponibles.</p>}
            </Card.Body>
        </Card>
    );
}

export default function MatchPage({ loaderData }: Route.ComponentProps) {
    const match = loaderData;
    const odds = [
        { label: "1", name: match.homeTeam.name, value: match.homeOdds },
        { label: "X", name: "Empate", value: match.drawOdds },
        { label: "2", name: match.awayTeam.name, value: match.awayOdds },
    ];

    return <Container as="main" className="py-4">
        <Link to="/matches">← Partidos</Link>
        <Card className="my-3"><Card.Body>
            <p>{match.competition.name} · {match.competition.country} · {match.competition.sport.name}</p>
            <p>{formatDate(match.matchDate)} <Badge bg="secondary">{match.gameStatus}</Badge></p>
            <Row className="align-items-center text-center">
                <Col xs={5}><h1 className="h3">{match.homeTeam.name}</h1></Col>
                <Col xs={2}><strong aria-label="Marcador no disponible">— : —</strong></Col>
                <Col xs={5}><h1 className="h3">{match.awayTeam.name}</h1></Col>
            </Row>
        </Card.Body></Card>

        <Row className="g-3">
            <Col lg={8}>
                <Card className="mb-3"><Card.Body>
                    <h2 className="h4">Cuotas · 1X2</h2>
                    <Row className="g-2">{odds.map(odd => <Col xs={4} key={odd.label}>
                        <Button className="w-100" disabled aria-label={`Cuota ${odd.label}, desactivada`}>
                            {odd.label} · {odd.name}<br />{odd.value == null ? "—" : odd.value.toFixed(2)}
                        </Button>
                    </Col>)}</Row>
                </Card.Body></Card>
                <h2 className="h4">Estadísticas de temporada</h2>
                <Row className="g-3"><Col md={6}><TeamStats name={match.homeTeam.name} team={match.homeTeam} /></Col>
                    <Col md={6}><TeamStats name={match.awayTeam.name} team={match.awayTeam} /></Col></Row>
            </Col>
            <Col lg={4}>
                <Card className="mb-3"><Card.Body><h2 className="h5">Chat en directo</h2><p>Próximamente</p></Card.Body></Card>
                <Card><Card.Body><h2 className="h5">Acciones</h2>
                    <Button className="w-100 mb-2" disabled>Iniciar apuesta · Próximamente</Button>
                    <Button variant="secondary" className="w-100" disabled>Generar predicción con IA · Próximamente</Button>
                </Card.Body></Card>
            </Col>
        </Row>
    </Container>;
}
