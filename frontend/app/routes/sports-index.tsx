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
            The excitement starts here
          </div>
          <h1 className="page-title hero-title">
            <span>Live the game</span>{" "}
            <span className="hero-accent">in every detail.</span>
          </h1>
          <p className="mt-3">
            Follow your favorite competitions, discover upcoming matches,
            and stay close to the action.
          </p>
          <Link className="btn btn-brand mt-2" to="/matches">
            Explore matches
          </Link>
        </div>
      </section>
      <div className="section-heading mt-0">
        <div>
          <div className="eyebrow mb-2">Find your game</div>
          <h2 className="section-title mb-0">Featured sports</h2>
        </div>
        <span className="muted small">
          {sports.length} sports available
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
              <p>Competitions, teams, and matches</p>
            </Link>
          </div>
        ))}
      </div>
      <div className="section-heading">
        <div>
          <div className="eyebrow mb-2">Follow the action</div>
          <h2 className="section-title mb-0">
            A better way to experience sports
          </h2>
        </div>
      </div>
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <article className="surface-card h-100">
            <span className="eyebrow">01 · Discover</span>
            <h3 className="h5 fw-bold mt-3">Everything starts with your sport</h3>
            <p className="muted mb-0">
              Explore competitions and find the matches you care about.
            </p>
          </article>
        </div>
        <div className="col-md-4">
          <article className="surface-card h-100">
            <span className="eyebrow">02 · Follow</span>
            <h3 className="h5 fw-bold mt-3">Every match, closer to you</h3>
            <p className="muted mb-0">
              Check schedules, teams, and odds all in one place.
            </p>
          </article>
        </div>
        <div className="col-md-4">
          <article className="surface-card h-100">
            <span className="eyebrow">03 · Enjoy</span>
            <h3 className="h5 fw-bold mt-3">Sports take center stage</h3>
            <p className="muted mb-0">
              A clean experience designed to accompany every matchday.
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}
