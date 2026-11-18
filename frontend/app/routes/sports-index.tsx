import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { MatchDTO } from "../dtos/MatchDTO";
import type { SportDTO } from "../dtos/SportDTO";
import type { Route } from "./+types/sports-index";
import { formatDateTime } from "../services/format-date";
import { getMatchesPage } from "../services/match-service";
import { getSports } from "../services/sport-service";

// React Router discovers this loader through the route module's exports.
// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
  const [sports, matches] = await Promise.all([
    getSports(),
    getMatchesPage(0, 3).catch(() => null),
  ]);
  return { sports, matches: matches?.content ?? null };
}

function SportRail({ sports }: { sports: SportDTO[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  function updateEdges() {
    const list = rail.current;
    if (!list) return;
    setEdges({
      start: list.scrollLeft < 2,
      end: list.scrollLeft + list.clientWidth >= list.scrollWidth - 2,
    });
  }

  useEffect(() => {
    if (!rail.current || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(rail.current);
    return () => observer.disconnect();
  }, [sports.length]);

  function move(direction: number) {
    const list = rail.current;
    const firstSport = list?.firstElementChild;
    if (!list || !firstSport) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    list.scrollBy({ left: direction * (firstSport.getBoundingClientRect().width + gap) });
  }

  return (
    <section className="home-section" aria-labelledby="sports-heading">
      <div className="home-section-header" id="sports">
        <div>
          <h2 id="sports-heading">Explore sports</h2>
          <p>{sports.length} sports available</p>
        </div>
        {sports.length > 1 && (
          <div className="sport-rail-controls">
            <button type="button" aria-label="Previous sport" aria-controls="sport-rail"
              disabled={edges.start} onClick={() => move(-1)}>←</button>
            <button type="button" aria-label="Next sport" aria-controls="sport-rail"
              disabled={edges.end} onClick={() => move(1)}>→</button>
          </div>
        )}
      </div>
      {sports.length ? (
        <ul id="sport-rail" ref={rail} className="sport-rail" aria-label="Sports catalog" onScroll={updateEdges}>
          {sports.map((sport) => (
            <li key={sport.id}>
              <Link className="sport-card" to={`/sport/${sport.id}`}>
                <span className="sport-icon" aria-hidden="true">
                  {sport.iconUrl ? <img src={sport.iconUrl} alt="" /> : sport.name.slice(0, 2).toUpperCase()}
                </span>
                <h3>{sport.name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      ) : <p className="home-empty">No sports are available yet.</p>}
    </section>
  );
}

function MatchSpotlight({ matches }: { matches: MatchDTO[] }) {
  const spotlight = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const [autoPlay, setAutoPlay] = useState(() =>
    typeof window !== "undefined" && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const [featuredId, setFeaturedId] = useState<number>();
  const featuredIndex = Math.max(matches.findIndex((match) => match.id === featuredId), 0);
  const featured = matches[featuredIndex];

  useEffect(() => {
    if (!autoPlay || hovered || matches.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.hidden || spotlight.current?.contains(document.activeElement)) return;
      setFeaturedId((id) => {
        const index = Math.max(matches.findIndex((match) => match.id === id), 0);
        return matches[(index + 1) % matches.length].id;
      });
    }, 6500);
    return () => window.clearInterval(timer);
  }, [autoPlay, hovered, matches]);

  return (
    <aside ref={spotlight} className="fixture-spotlight" aria-label="Featured matches"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}>
      <div className="spotlight-heading">
        <h2>Match spotlight</h2>
        <time dateTime={featured.matchDate}>{formatDateTime(featured.matchDate)}</time>
      </div>
      <Link className="featured-fixture" to={`/match/${featured.id}`}>
        <span className="spotlight-team">{featured.homeTeamLogoUrl && <img src={featured.homeTeamLogoUrl} alt="" />}{featured.homeTeam}</span>
        <span className="spotlight-versus">vs</span>
        <span className="spotlight-team">{featured.awayTeamLogoUrl && <img src={featured.awayTeamLogoUrl} alt="" />}{featured.awayTeam}</span>
      </Link>
      {matches.length > 1 && (
        <div className="spotlight-controls">
          <div className="spotlight-switcher" role="group" aria-label="Choose featured match">
            {matches.map((match) => (
              <button type="button" key={match.id} aria-pressed={match.id === featured.id}
                aria-label={`Feature ${match.homeTeam} vs ${match.awayTeam}`} onClick={() => setFeaturedId(match.id)} />
            ))}
          </div>
          <button type="button" className="spotlight-playback" onClick={() => setAutoPlay(!autoPlay)}
            aria-label={autoPlay ? "Pause spotlight rotation" : "Play spotlight rotation"}>
            <span aria-hidden="true">{autoPlay ? "Ⅱ" : "▶"}</span>
          </button>
        </div>
      )}
    </aside>
  );
}

export default function SportsHome({ loaderData: { sports, matches } }: Route.ComponentProps) {
  return (
    <main className="sports-home">
      <section className="sports-hero" aria-labelledby="home-title">
        <div className="sports-hero-inner container-xl">
          <div className="sports-hero-copy">
            <h1 id="home-title">The match<br /><em>starts here.</em></h1>
            <p>Find fixtures, follow competitions and compare teams across the BetSphere sports catalog.</p>
            <div className="hero-actions">
              <Link className="btn btn-brand" to="/matches">Explore matches</Link>
              <a className="hero-jump" href="#sports">Browse sports</a>
            </div>
          </div>
          {matches && matches.length > 0 && <MatchSpotlight matches={matches} />}
        </div>
      </section>

      <div className="sports-catalog"><div className="container-xl"><SportRail sports={sports} /></div></div>

      <section className="home-schedule" aria-labelledby="fixtures-heading">
        <div className="container-xl">
        <div className="home-section-header">
          <h2 id="fixtures-heading">From the schedule</h2>
          <Link className="schedule-link" to="/matches">All matches</Link>
        </div>
        {matches?.length ? (
          <ul className="home-fixtures">
            {matches.map((match) => (
              <li key={match.id}>
                <Link to={`/match/${match.id}`}>
                  <span className="fixture-status">{match.gameStatus.toLowerCase().replaceAll("_", " ")}</span>
                  <span className="fixture-teams">
                    <strong>{match.homeTeamLogoUrl && <img src={match.homeTeamLogoUrl} alt="" />}{match.homeTeam}</strong>
                    <span>vs</span>
                    <strong>{match.awayTeamLogoUrl && <img src={match.awayTeamLogoUrl} alt="" />}{match.awayTeam}</strong>
                  </span>
                  <time dateTime={match.matchDate}>{formatDateTime(match.matchDate)}</time>
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="home-empty">{matches ? "No matches are scheduled yet." : "The schedule is temporarily unavailable."}</p>}
        </div>
      </section>
    </main>
  );
}
