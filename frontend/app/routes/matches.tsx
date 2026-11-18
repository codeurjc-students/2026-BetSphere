import type { Route } from "./+types/matches";
import { useFetcher } from "react-router";
import FixtureExplorer from "../components/FixtureExplorer";
import { useState } from "react";
import LoadMore from "../components/LoadMore";
import { getMatchesPage } from "../services/match-service";

const PAGE_SIZE = 10;

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const page = Math.max(0, Number(url.searchParams.get("page") ?? 0));
  return getMatchesPage(page, PAGE_SIZE);
}

export default function MatchList({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher<typeof clientLoader>();
  const [list, setList] = useState({ loaderData, response: fetcher.data, matches: loaderData.content, page: loaderData });
  if (loaderData !== list.loaderData) {
    setList({ loaderData, response: fetcher.data, matches: loaderData.content, page: loaderData });
  } else if (fetcher.data && fetcher.data !== list.response) {
    const next = fetcher.data;
    if (next.number === list.page.number + 1) {
      const loadedIds = new Set(list.matches.map((match) => match.id));
      const matches = [...list.matches, ...next.content.filter((match) => !loadedIds.has(match.id))];
      setList({ loaderData, response: next, matches, page: next });
    } else {
      setList({ ...list, response: next });
    }
  }
  const { matches, page } = list;
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
