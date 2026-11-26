import type { Route } from "./+types/matches";
import { useFetcher, useLocation, useNavigation, useSearchParams } from "react-router";
import FixtureExplorer, { type FixtureStatus } from "../components/FixtureExplorer";
import { useState } from "react";
import LoadMore from "../components/LoadMore";
import { getMatchesPage } from "../services/match-service";

const PAGE_SIZE = 10;
const API_STATUSES = { All: undefined, Upcoming: "SCHEDULED", Finished: "FINISHED" } as const;

function readFilters(params: URLSearchParams): { query: string; filter: FixtureStatus } {
  const status = params.get("status");
  return {
    query: params.get("q") ?? "",
    filter: status === "upcoming" ? "Upcoming" : status === "finished" ? "Finished" : "All",
  };
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? 0);
  const filters = readFilters(url.searchParams);
  const data = await getMatchesPage(Number.isSafeInteger(page) && page > 0 ? page : 0, PAGE_SIZE, {
    query: filters.query, status: API_STATUSES[filters.filter], signal: request.signal,
  });
  return { ...data, filters };
}

export default function MatchList({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher<typeof clientLoader>();
  const location = useLocation();
  const navigation = useNavigation();
  const [params, setParams] = useSearchParams();
  const pending = navigation.location?.pathname === location.pathname ? navigation.location : undefined;
  const { query, filter } = pending ? readFilters(new URLSearchParams(pending.search)) : loaderData.filters;
  const [list, setList] = useState({ loaderData, response: fetcher.data, matches: loaderData.content, page: loaderData });
  if (loaderData !== list.loaderData) {
    setList({ loaderData, response: fetcher.data, matches: loaderData.content, page: loaderData });
  } else if (fetcher.data && fetcher.data !== list.response) {
    const next = fetcher.data;
    if (next.number === list.page.number + 1 && next.filters.query === loaderData.filters.query
      && next.filters.filter === loaderData.filters.filter) {
      const loadedIds = new Set(list.matches.map((match) => match.id));
      const matches = [...list.matches, ...next.content.filter((match) => !loadedIds.has(match.id))];
      setList({ loaderData, response: next, matches, page: next });
    } else {
      setList({ ...list, response: next });
    }
  }
  const { matches, page } = list;

  function changeFilters(nextQuery: string, nextFilter: FixtureStatus) {
    const next = new URLSearchParams(pending?.search ?? params);
    next.delete("page");
    if (nextQuery) next.set("q", nextQuery);
    else next.delete("q");
    if (nextFilter === "All") next.delete("status");
    else next.set("status", nextFilter.toLowerCase());
    setParams(next, { replace: true, preventScrollReset: true });
  }

  function loadNextPage() {
    const next = new URLSearchParams(params);
    next.set("page", String(page.number + 1));
    fetcher.load(`${location.pathname}?${next}`);
  }

  return (
    <main className="container-xl arena-page">
      <header className="arena-hero schedule-hero">
        <h1 className="page-title">Matches</h1>
        <p>Find fixtures by team or match status.</p>
      </header>
      <FixtureExplorer matches={matches} remoteSearch={{ query, filter, onChange: changeFilters }} />
      {!page.last && <LoadMore loading={Boolean(pending) || fetcher.state !== "idle"} onClick={loadNextPage} />}
    </main>
  );
}
