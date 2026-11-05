import type { Route } from "./+types/sports";
import { Link } from "react-router";
import { getById } from "../services/sport-service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0)
    throw new Response("Invalid sport id", { status: 400 });
  return getById(id);
}

export default function SportPage({ loaderData: sport }: Route.ComponentProps) {
  return (
    <main className="container-xl py-5 page-enter">
      <Link className="back-link" to="/">← Todos los deportes</Link>
      <section className="sport-hero mt-4">
        {sport.iconUrl && <img className="sport-hero-logo" src={sport.iconUrl} alt="" />}
        <div>
          <div className="eyebrow mb-1">Explora el deporte</div>
          <h1 className="page-title mb-0">{sport.name}</h1>
        </div>
      </section>
      <div className="section-heading mt-5">
        <div><div className="eyebrow mb-2">Competiciones disponibles</div><h2 className="section-title mb-0">Competiciones</h2></div>
        <span className="muted small">{sport.competitions.length} en total</span>
      </div>
      {sport.competitions.length === 0 ? (
        <div className="surface-card muted">Todavía no hay competiciones para este deporte.</div>
      ) : (
        <div className="row g-3">
          {sport.competitions.map((competition) => (
            <div className="col-12 col-md-6 col-lg-4" key={competition.id}>
              <Link className="sport-competition-card" to={`/competition/${competition.id}`}>
                <span className="sport-competition-logo">
                  {competition.iconUrl ? <img src={competition.iconUrl} alt="" /> : <span aria-hidden="true">🏆</span>}
                </span>
                <span className="sport-competition-copy">
                  <strong>{competition.name}</strong>
                  {competition.country && <span>{competition.country}</span>}
                </span>
                <span className="sport-competition-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
