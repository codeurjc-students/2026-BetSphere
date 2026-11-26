import { useState } from "react";
import { Link } from "react-router";
import type { MatchDTO } from "../dtos/MatchDTO";
import { formatDateTime } from "../services/format-date";
import { formatOdds } from "../services/format-odds";

const statuses = ["All", "Upcoming", "Finished"] as const;
export type FixtureStatus = typeof statuses[number];

type RemoteSearch = {
  query: string;
  filter: FixtureStatus;
  onChange: (query: string, filter: FixtureStatus) => void;
};

export default function FixtureExplorer({
  matches, initialFilter = "All", remoteSearch,
}: {
  matches: MatchDTO[];
  initialFilter?: FixtureStatus;
  remoteSearch?: RemoteSearch;
}) {
  const [localFilter, setLocalFilter] = useState(initialFilter);
  const [localQuery, setLocalQuery] = useState("");
  const [openedAt] = useState(Date.now);
  const filter = remoteSearch?.filter ?? localFilter;
  const query = remoteSearch?.query ?? localQuery;
  const changeFilters = remoteSearch?.onChange ?? ((text, status) => {
    setLocalQuery(text);
    setLocalFilter(status);
  });
  const search = query.trim().toLowerCase();
  const visible = remoteSearch ? matches : matches.filter((match) => {
    const finished = match.gameStatus === "FINISHED";
    const upcoming = match.gameStatus === "SCHEDULED" && new Date(match.matchDate).getTime() >= openedAt;
    return (filter === "All" || (filter === "Upcoming" ? upcoming : finished))
      && `${match.homeTeam} ${match.awayTeam}`.toLowerCase().includes(search);
  });

  return (
    <div className="fixture-explorer">
      <div className="explorer-toolbar">
        <div className="segmented" role="group" aria-label="Match status">
          {statuses.map((status) => (
            <button key={status} type="button" aria-pressed={status === filter} onClick={() => changeFilters(query, status)}>
              {status}
            </button>
          ))}
        </div>
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <span className="visually-hidden">Find a team</span>
          <input type="search" placeholder="Find a team" value={query} onChange={(event) => changeFilters(event.target.value, filter)} />
        </label>
      </div>
      <p className="result-count" aria-live="polite">
        {visible.length} {visible.length === 1 ? "match" : "matches"}
      </p>
      {visible.length ? (
        <div className="fixture-programme">
          {visible.map((match) => (
            <Link className="programme-row" to={`/match/${match.id}`} key={match.id}
              aria-label={`${match.homeTeam} vs ${match.awayTeam}`} aria-describedby={`fixture-odds-${match.id}`}>
              <span className="programme-meta">
                <time dateTime={match.matchDate}>{formatDateTime(match.matchDate)}</time>
                <span className="match-status">{match.gameStatus.replaceAll("_", " ")}</span>
              </span>
              <span className="programme-teams">
                <span>{match.homeTeamLogoUrl && <img src={match.homeTeamLogoUrl} alt="" />}{match.homeTeam}</span>
                <span>{match.awayTeamLogoUrl && <img src={match.awayTeamLogoUrl} alt="" />}{match.awayTeam}</span>
              </span>
              <span className="programme-odds" id={`fixture-odds-${match.id}`}>
                <span className="visually-hidden">Reference odds. </span>
                {([
                  ["1", "Home", match.homeOdds],
                  ["X", "Draw", match.drawOdds],
                  ["2", "Away", match.awayOdds],
                ] as const).map(([label, name, value]) => (
                  <span className="programme-odd" key={label}>
                    <span aria-hidden="true">{label}</span>
                    <span className="visually-hidden">{name} </span>
                    <strong>{formatOdds(value)}</strong>
                  </span>
                ))}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-panel">
          <p>{filter === "Upcoming" && !search ? "No upcoming matches." : "No matches available."}</p>
          {(filter !== "All" || query) && (
            <button type="button" className="btn btn-outline-light" onClick={() => changeFilters("", "All")}>
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
