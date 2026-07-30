const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatMonthYear(value?: string): string {
  if (!value) return "";
  if (value === "Present") return "Present";

  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;

  const year = match[1];
  const monthIndex = Number(match[2]) - 1;
  const monthLabel = MONTH_LABELS[monthIndex];

  return monthLabel ? `${monthLabel} ${year}` : value;
}
