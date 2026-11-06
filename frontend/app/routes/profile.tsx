import { useEffect } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/profile";
import { requireUser } from "../services/auth-guards";
import { apiFetch } from "../services/api-client";
import { useAuthStore } from "../stores/auth-store";

export function clientLoader(args: Route.ClientLoaderArgs) {
  return requireUser(args);
}

export async function clientAction(args: Route.ClientActionArgs) {
  await requireUser(args);
  const formData = await args.request.formData();
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return { error: "Selecciona una imagen." };
  try {
    const body = new FormData(); body.append("file", file);
    const response = await apiFetch("/api/v1/images", { method: "POST", body });
    const result = await response.json() as { url: string };
    return { avatarUrl: result.url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo subir la imagen." };
  }
}

function formatBalance(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default function ProfilePage({ loaderData: user }: Route.ComponentProps) {
  const fetcher = useFetcher<typeof clientAction>();
  const setCurrentUser = useAuthStore((state) => state.setUser);
  useEffect(() => {
    if (fetcher.data && "avatarUrl" in fetcher.data) setCurrentUser({ ...user, avatarUrl: fetcher.data.avatarUrl });
  }, [fetcher.data, setCurrentUser, user]);
  const avatarUrl = fetcher.data && "avatarUrl" in fetcher.data ? fetcher.data.avatarUrl : user.avatarUrl;
  const busy = fetcher.state !== "idle";
  const initials = user.username.slice(0, 1).toLocaleUpperCase("es-ES");

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
              <label className="btn btn-outline-light w-100 mb-2">{busy ? "Subiendo…" : "Cambiar foto"}<input className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) { const body = new FormData(); body.append("avatar", file); fetcher.submit(body, { method: "post", encType: "multipart/form-data" }); } event.target.value = ""; }} /></label>
              {fetcher.data && "error" in fetcher.data && <p role="alert" className="small text-danger">{fetcher.data.error}</p>}
              {fetcher.data && "avatarUrl" in fetcher.data && <p role="status" className="small muted">Foto de perfil actualizada.</p>}
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
