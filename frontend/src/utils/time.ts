// Formats time in seconds to "M:SS" format
export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Format date into relative time (e.g., "3 days ago")
export function timeAgoIntl(date: string | Date | undefined) {
  if (!date) return "";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const past = new Date(date);
  const diff = (past.getTime() - now.getTime()) / 1000; // in seconds

  const divisions = [
    { amount: 60, unit: "seconds" },
    { amount: 60, unit: "minutes" },
    { amount: 24, unit: "hours" },
    { amount: 7, unit: "days" },
    { amount: 4.34524, unit: "weeks" },
    { amount: 12, unit: "months" },
    { amount: Number.POSITIVE_INFINITY, unit: "years" },
  ];

  let duration = diff;
  for (let i = 0; i < divisions.length; i++) {
    if (Math.abs(duration) < divisions[i].amount) {
      return rtf.format(Math.round(duration), divisions[i].unit as any);
    }
    duration /= divisions[i].amount;
  }
}
