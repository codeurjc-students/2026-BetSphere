import type { Route } from "./+types/matches";
import { Link, useFetcher } from "react-router";
import { formatDateTime } from "../services/format-date";
import { useEffect, useState } from "react";
import LoadMore from "../components/LoadMore";
import { getMatchesPage } from "../services/match-service";
import type { PageDTO } from "../dtos/PageDTO";

const PAGE_SIZE = 10;

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const page = Math.max(0, Number(url.searchParams.get("page") ?? 0));
  return getMatchesPage(page, PAGE_SIZE);
}

export default function MatchList({ loaderData }: Route.ComponentProps) {
  const [matches, setMatches] = useState(loaderData.content);
  const [page, setPage] = useState(loaderData);
  const fetcher = useFetcher<typeof clientLoader>();
  useEffect(() => {
    if (!fetcher.data || !("content" in fetcher.data)) return;
    const next = fetcher.data as PageDTO<(typeof matches)[number]>;
    setMatches((current) => [...current, ...next.content]);
    setPage(next);
  }, [fetcher.data]);
  return (
    <main className="container-xl py-5">
      <div className="eyebrow">Schedule</div>
      <h1 className="page-title">Matches</h1>
      <p className="muted mb-4">All the action, in one place.</p>
      {matches.length ? (
        matches.map((match) => (
          <Link className="match-row" to={`/match/${match.id}`} key={match.id}>
            <div>
              <div className="match-teams">
                {match.homeTeamLogoUrl && <img className="entity-logo me-2" src={match.homeTeamLogoUrl} alt="" />}
                {match.homeTeam} <span className="muted">vs</span>{" "}
                {match.awayTeamLogoUrl && <img className="entity-logo me-2" src={match.awayTeamLogoUrl} alt="" />}
                {match.awayTeam}
              </div>
              <div className="match-meta">
                {formatDateTime(match.matchDate)}
              </div>
            </div>
            <div className="text-end">
              <div className="match-status">{match.gameStatus}</div>
              <span className="small muted">View match →</span>
            </div>
          </Link>
        ))
      ) : (
        <div className="surface-card muted">No matches available.</div>
      )}
      {!page.last && <LoadMore loading={fetcher.state !== "idle"} onClick={() => fetcher.load(`/matches?page=${page.number + 1}&size=${PAGE_SIZE}`)} />}
    </main>
  );
}
