const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short", day: "numeric", month: "short", year: "numeric",
  hour: "2-digit", minute: "2-digit",
});

export function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTimeFormatter.format(date).replace(",", " ·");
}
