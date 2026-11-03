import { Link } from "react-router";
export default function ProfilePage() {
  return (
    <main className="container-xl py-5">
      <div className="eyebrow">Tu espacio</div>
      <h1 className="page-title">Mi perfil</h1>
      <div className="row g-3 mt-2">
        <div className="col-lg-4">
          <section className="surface-card">
            <div className="team-avatar mb-3">C</div>
            <h2 className="h4 fw-bold">Carlos Martínez</h2>
            <p className="muted">carlos@example.com</p>
            <span className="badge text-bg-success">Cuenta verificada</span>
            <hr />
            <Link className="text-link" to="/history">
              Ver historial →
            </Link>
          </section>
        </div>
        <div className="col-lg-8">
          <div className="row g-3">
            <div className="col-sm-6">
              <div className="stat-card">
                <span>Saldo disponible</span>
                <strong>125,50 €</strong>
                <button className="btn btn-brand mt-3" disabled>
                  Añadir fondos · Próximamente
                </button>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="stat-card">
                <span>Actividad este mes</span>
                <strong>12 partidos</strong>
                <span className="mt-2">Datos de demostración</span>
              </div>
            </div>
          </div>
          <section className="surface-card mt-3">
            <h2 className="h5 fw-bold">Datos personales</h2>
            <p className="muted mb-0">
              La edición del perfil estará disponible próximamente.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
