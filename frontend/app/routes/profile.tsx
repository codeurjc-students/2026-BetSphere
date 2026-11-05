import { useState } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router";
import type { Route } from "./+types/profile";
import { requireUser } from "../services/auth-guards";
import { adminFetch, adminResponseError } from "../services/admin-api";
import { useAuthStore } from "../stores/auth-store";

export function clientLoader(args: Route.ClientLoaderArgs) {
  return requireUser(args);
}

function formatBalance(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default function ProfilePage({ loaderData: user }: Route.ComponentProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const setCurrentUser = useAuthStore((state) => state.setUser);
  const initials = user.username.slice(0, 1).toLocaleUpperCase("es-ES");

  async function uploadAvatar(file?: File) {
    if (!file) return;
    setBusy(true); setMessage("");
    try {
      const form = new FormData(); form.append("file", file);
      const response = await adminFetch("/api/v1/images", { method: "POST", body: form });
      if (!response.ok) throw new Error(await adminResponseError(response, "No se pudo subir la imagen"));
      const result = await response.json();
      setAvatarUrl(result.url);
      setCurrentUser({ ...user, avatarUrl: result.url });
      setMessage("Foto de perfil actualizada.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo subir la imagen"); }
    finally { setBusy(false); }
  }

  return (
    <main className="container-xl py-5 page-enter">
      <div className="eyebrow">Tu espacio</div>
      <h1 className="page-title">Mi perfil</h1>
      <Row className="g-4 mt-1">
        <Col lg={4}>
          <Card className="stats-card h-100">
            <Card.Body className="p-4">
              <div className="profile-avatar mb-3" aria-label={`Avatar de ${user.username}`}>
                {avatarUrl ? <img src={avatarUrl} alt={`Foto de ${user.username}`} /> : initials}
              </div>
              <label className="btn btn-outline-light w-100 mb-2">Cambiar foto<input className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(event) => { void uploadAvatar(event.target.files?.[0]); event.target.value = ""; }} /></label>
              {message && <p role="status" className="small muted">{message}</p>}
              <h2 className="h4 fw-bold mb-1">{user.username}</h2>
              <p className="muted text-break">{user.email}</p>
              <Badge bg="success" className="mb-3">Cuenta registrada</Badge>
              <hr />
              <Link to="/history" className="btn btn-outline-light w-100">
                Ver mi historial
              </Link>
              {user.roles.includes("ROLE_ADMIN") && (
                <Link to="/admin" className="btn btn-brand w-100 mt-2">
                  Ir al panel de administración
                </Link>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Row className="g-3">
            <Col sm={6}>
              <Card className="stats-card h-100">
                <Card.Body>
                  <div className="eyebrow mb-2">Saldo virtual</div>
                  <strong className="profile-stat">{formatBalance(user.virtualBalance)}</strong>
                  <p className="muted mt-2 mb-0">Saldo disponible en tu cuenta</p>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="stats-card h-100">
                <Card.Body>
                  <div className="eyebrow mb-2">Rol</div>
                  <strong className="profile-stat">{user.roles.includes("ROLE_ADMIN") ? "Administrador" : "Usuario"}</strong>
                  <p className="muted mt-2 mb-0">Permisos asociados a tu cuenta</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card className="stats-card mt-3">
            <Card.Body>
              <h2 className="h5 fw-bold">Datos personales</h2>
              <dl className="row mb-0 mt-3">
                <dt className="col-sm-4 muted">Nombre de usuario</dt>
                <dd className="col-sm-8">{user.username}</dd>
                <dt className="col-sm-4 muted">Correo electrónico</dt>
                <dd className="col-sm-8 text-break">{user.email}</dd>
                <dt className="col-sm-4 muted">Fecha de nacimiento</dt>
                <dd className="col-sm-8">{user.birthDate ? new Date(`${user.birthDate}T00:00:00`).toLocaleDateString("es-ES") : "No disponible"}</dd>
              </dl>
              <p className="small muted mb-0">La edición del perfil estará disponible próximamente.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
