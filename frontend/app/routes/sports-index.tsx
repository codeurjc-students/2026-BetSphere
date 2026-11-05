import type { Route } from "./+types/sports-index";
import { Link } from "react-router";
import { getSports } from "../services/sport-service";

export async function clientLoader() {
  return getSports();
}

export default function SportsHome({
  loaderData: sports,
}: Route.ComponentProps) {
  return (
    <main className="container-xl py-4 py-lg-5">
      <section className="hero-panel mb-5">
        <div className="hero-copy">
          <div className="eyebrow text-success mb-3">
            La emoción empieza aquí
          </div>
          <h1 className="page-title hero-title">
            <span>El juego se vive</span>{" "}
            <span className="hero-accent">en cada detalle.</span>
          </h1>
          <p className="mt-3">
            Sigue tus competiciones favoritas, descubre los próximos encuentros
            y mantente cerca de cada partido.
          </p>
          <Link className="btn btn-brand mt-2" to="/matches">
            Explorar partidos
          </Link>
        </div>
      </section>
      <div className="section-heading mt-0">
        <div>
          <div className="eyebrow mb-2">Encuentra tu juego</div>
          <h2 className="section-title mb-0">Deportes destacados</h2>
        </div>
        <span className="muted small">
          {sports.length} deportes disponibles
        </span>
      </div>
      <div className="row g-3">
        {sports.map((sport, index) => (
          <div className="col-12 col-sm-6 col-lg-4" key={sport.id}>
            <Link className="sport-card" to={`/sport/${sport.id}`}>
              <span className="sport-icon" aria-hidden="true">
                {sport.iconUrl ? <img src={sport.iconUrl} alt="" /> : ["⚽", "🏀", "🎾", "🏈", "🏐", "🏒"][index % 6]}
              </span>
              <h3>{sport.name}</h3>
              <p>Competiciones, equipos y partidos</p>
            </Link>
          </div>
        ))}
      </div>
      <div className="section-heading">
        <div>
          <div className="eyebrow mb-2">Sigue la acción</div>
          <h2 className="section-title mb-0">
            Una mejor forma de vivir el deporte
          </h2>
        </div>
      </div>
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <article className="surface-card h-100">
            <span className="eyebrow">01 · Descubre</span>
            <h3 className="h5 fw-bold mt-3">Todo empieza con tu deporte</h3>
            <p className="muted mb-0">
              Explora competiciones y encuentra los encuentros que te interesan.
            </p>
          </article>
        </div>
        <div className="col-md-4">
          <article className="surface-card h-100">
            <span className="eyebrow">02 · Sigue</span>
            <h3 className="h5 fw-bold mt-3">Cada partido, más cerca</h3>
            <p className="muted mb-0">
              Consulta horarios, equipos y cuotas desde un mismo lugar.
            </p>
          </article>
        </div>
        <div className="col-md-4">
          <article className="surface-card h-100">
            <span className="eyebrow">03 · Disfruta</span>
            <h3 className="h5 fw-bold mt-3">El deporte es el protagonista</h3>
            <p className="muted mb-0">
              Una experiencia clara, pensada para acompañar cada jornada.
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}
