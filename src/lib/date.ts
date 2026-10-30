type Division = {
  amount: number;
  name: Intl.RelativeTimeFormatUnit;
};

const DIVISIONS: readonly Division[] = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
] as const;

function formatTimeAgo(date: string | Date): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(targetDate.getTime())) {
    throw new RangeError("Invalid time value passed to formatTimeAgo");
  }

  const formatter = new Intl.RelativeTimeFormat("en-GB", {
    numeric: "auto",
  });

  const now = new Date();
  let duration = (targetDate.getTime() - now.getTime()) / 1000;

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }

  return formatter.format(0, "seconds");
}