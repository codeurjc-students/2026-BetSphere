import { Badge, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router";
import type { Route } from "./+types/history";
import { requireUser } from "../services/auth-guards";

export function clientLoader(args: Route.ClientLoaderArgs) {
  return requireUser(args);
}

function formatBalance(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default function HistoryPage({ loaderData: user }: Route.ComponentProps) {
  return (
    <main className="container-xl py-5 page-enter">
      <div className="eyebrow">Tu actividad</div>
      <h1 className="page-title">Historial</h1>
      <p className="muted">Actividad de la cuenta de {user.username}</p>

      <Row className="g-3 mt-2">
        <Col md={6}>
          <Card className="stats-card h-100">
            <Card.Body>
              <div className="eyebrow mb-2">Saldo virtual actual</div>
              <strong className="profile-stat">{formatBalance(user.virtualBalance)}</strong>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="stats-card h-100">
            <Card.Body>
              <div className="eyebrow mb-2">Apuestas registradas</div>
              <strong className="profile-stat">—</strong>
              <p className="muted mt-2 mb-0">El historial de apuestas aún no está disponible.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="stats-card mt-4">
        <Card.Body className="p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h2 className="h5 fw-bold mb-1">Actividad reciente</h2>
              <p className="muted mb-0">Aquí aparecerán tus apuestas cuando esté disponible esa función.</p>
            </div>
            <Badge bg="secondary">Sin movimientos</Badge>
          </div>
          <div className="history-empty-state mt-4">
            <div className="history-empty-icon" aria-hidden="true">↗</div>
            <p className="fw-semibold mb-1">Todavía no hay actividad que mostrar</p>
            <p className="muted mb-3">Explora los partidos y vuelve cuando puedas registrar tus apuestas.</p>
            <Link className="btn btn-brand" to="/matches">Explorar partidos</Link>
          </div>
        </Card.Body>
      </Card>
    </main>
  );
}
