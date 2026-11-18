import type { Route } from "./+types/sports";
import { useState } from "react";
import { Link } from "react-router";
import { getById } from "../services/sport-service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0)
    throw new Response("Invalid sport id", { status: 400 });
  return getById(id);
}

export default function SportPage({ loaderData: sport }: Route.ComponentProps) {
  const [country, setCountry] = useState("");
  const countries = [...new Set(sport.competitions.map((competition) => competition.country).filter(Boolean))];
  const competitions = sport.competitions.filter((competition) => !country || competition.country === country);
  return (
    <main className="container-xl arena-page">
      <Link className="back-link" to="/">All sports</Link>
      <section className="arena-hero sport-hero mt-4">
        {sport.iconUrl && <img className="sport-hero-logo" src={sport.iconUrl} alt="" />}
        <h1 className="page-title mb-0">{sport.name}</h1>
      </section>
      <div className="section-heading mt-5">
        <h2 className="section-title mb-0">Competitions</h2>
        {countries.length > 1 && (
          <label className="country-filter">
            Country
            <select className="form-select" value={country} onChange={(event) => setCountry(event.target.value)}>
              <option value="">All countries</option>
              {countries.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
        )}
      </div>
      {sport.competitions.length === 0 ? (
        <div className="surface-card muted">There are no competitions for this sport yet.</div>
      ) : (
        <div className="competition-grid">
          {competitions.map((competition) => (
            <div className="league-tile" key={competition.id}>
              <Link className="sport-competition-card" to={`/competition/${competition.id}`}>
                <span className="sport-competition-logo">
                  {competition.iconUrl ? <img src={competition.iconUrl} alt="" /> : <span aria-hidden="true">{competition.name.slice(0, 2).toUpperCase()}</span>}
                </span>
                <span className="sport-competition-copy">
                  <strong>{competition.name}</strong>
                  {competition.country && <span>{competition.country}</span>}
                </span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
