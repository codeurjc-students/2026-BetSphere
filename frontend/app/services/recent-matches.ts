import type { MatchViewDTO } from "../dtos/MatchViewDTO";

interface ViewedMatch {
  id: number;
  name: string;
  competition: string;
  viewedAt: string;
}

const MAX_RECENT = 5;
const storageKey = (userId: number) => `betsphere:recent-matches:${userId}`;

function isViewedMatch(value: unknown): value is ViewedMatch {
  if (!value || typeof value !== "object") return false;
  const match = value as Partial<ViewedMatch>;
  return typeof match.id === "number" && Number.isInteger(match.id) && match.id > 0
    && typeof match.name === "string" && typeof match.competition === "string"
    && typeof match.viewedAt === "string" && Number.isFinite(Date.parse(match.viewedAt));
}

export function getRecentMatches(userId: number): ViewedMatch[] {
  try {
    const records: unknown = JSON.parse(window.localStorage.getItem(storageKey(userId)) ?? "[]");
    return Array.isArray(records) ? records.filter(isViewedMatch).slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

export function rememberMatch(userId: number, match: MatchViewDTO) {
  const record: ViewedMatch = {
    id: match.id,
    name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    competition: match.competition.name,
    viewedAt: new Date().toISOString(),
  };
  const previous = getRecentMatches(userId).filter(({ id }) => id !== match.id);
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify([record, ...previous].slice(0, MAX_RECENT)));
  } catch {
    // The match page remains usable when browser storage is unavailable.
  }
}
