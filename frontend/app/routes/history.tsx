import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/history";
import { requireUser } from "../services/auth-guards";
import { formatDateTime } from "../services/format-date";
import { getRecentMatches } from "../services/recent-matches";

export function clientLoader(args: Route.ClientLoaderArgs) {
  return requireUser(args);
}

function formatBalance(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function RecentlyViewed({ userId }: { userId: number }) {
  const [matches] = useState(() => getRecentMatches(userId));

  return (
    <section className="history-views" aria-labelledby="recent-matches-heading">
      <div className="history-section-top">
        <div>
          <h2 id="recent-matches-heading">Recently viewed matches</h2>
          <p>Matches you opened on this browser while signed in.</p>
        </div>
        <Link className="text-link" to="/matches">Explore matches</Link>
      </div>
      {matches.length ? (
        <ul className="history-matches">
          {matches.map((match) => (
            <li key={match.id}>
              <Link to={`/match/${match.id}`}>
                <span><strong>{match.name}</strong><small>{match.competition}</small></span>
                <time dateTime={match.viewedAt}>{formatDateTime(match.viewedAt)}</time>
              </Link>
            </li>
          ))}
        </ul>
      ) : <p className="history-empty">Open a match to add it here.</p>}
    </section>
  );
}

export default function HistoryPage({ loaderData: user }: Route.ComponentProps) {
  return (
    <main className="container-xl arena-page account-page history-page">
      <header className="arena-hero account-hero history-heading">
        <div>
          <h1 className="page-title">History</h1>
          <p>Account activity for {user.username}</p>
        </div>
        <Link to="/profile" className="text-link">My Profile</Link>
      </header>
      <div className="history-layout">
        <section className="balance-panel">
          <h2>Current virtual balance</h2>
          <strong>{formatBalance(user.virtualBalance)}</strong>
        </section>
        <section className="history-ledger" aria-labelledby="ledger-heading">
          <h2 id="ledger-heading">Betting activity</h2>
          <div className="history-empty">
            <strong>No activity to display yet</strong>
            <p>Virtual bets and their results will appear here when betting is available.</p>
          </div>
        </section>
        <RecentlyViewed key={user.id} userId={user.id} />
      </div>
    </main>
  );
}
