export function formatOdds(value: number | null) {
  return value !== null && Number.isFinite(value) && value > 0 ? value.toFixed(2) : "—";
}
