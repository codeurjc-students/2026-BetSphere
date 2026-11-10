import { Badge, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router";
import type { Route } from "./+types/history";
import { requireUser } from "../services/auth-guards";

export function clientLoader(args: Route.ClientLoaderArgs) {
  return requireUser(args);
}

function formatBalance(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default function HistoryPage({ loaderData: user }: Route.ComponentProps) {
  return (
    <main className="container-xl py-5 page-enter">
      <div className="eyebrow">Your activity</div>
      <h1 className="page-title">History</h1>
      <p className="muted">Account activity for {user.username}</p>

      <Row className="g-3 mt-2">
        <Col md={6}>
          <Card className="stats-card h-100">
            <Card.Body>
              <div className="eyebrow mb-2">Current virtual balance</div>
              <strong className="profile-stat">{formatBalance(user.virtualBalance)}</strong>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="stats-card h-100">
            <Card.Body>
              <div className="eyebrow mb-2">Placed bets</div>
              <strong className="profile-stat">—</strong>
              <p className="muted mt-2 mb-0">Betting history is not yet available.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="stats-card mt-4">
        <Card.Body className="p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h2 className="h5 fw-bold mb-1">Recent activity</h2>
              <p className="muted mb-0">Your bets will appear here once this feature is available.</p>
            </div>
            <Badge bg="secondary">No activity</Badge>
          </div>
          <div className="history-empty-state mt-4">
            <div className="history-empty-icon" aria-hidden="true">↗</div>
            <p className="fw-semibold mb-1">No activity to display yet</p>
            <p className="muted mb-3">Explore matches and check back once betting is enabled.</p>
            <Link className="btn btn-brand" to="/matches">Explore matches</Link>
          </div>
        </Card.Body>
      </Card>
    </main>
  );
}
