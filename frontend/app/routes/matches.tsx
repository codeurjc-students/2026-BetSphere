import type { Route } from "./+types/matches";
import { useFetcher } from "react-router";
import FixtureExplorer from "../components/FixtureExplorer";
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
    <main className="container-xl arena-page">
      <header className="arena-hero schedule-hero">
        <h1 className="page-title">Matches</h1>
        <p>Find fixtures by team or match status.</p>
      </header>
      <FixtureExplorer matches={matches} paginated />
      {!page.last && <LoadMore loading={fetcher.state !== "idle"} onClick={() => fetcher.load(`/matches?page=${page.number + 1}&size=${PAGE_SIZE}`)} />}
    </main>
  );
}
