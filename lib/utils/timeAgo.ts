export function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);

  const diffSeconds = Math.floor(
    (now.getTime() - past.getTime()) / 1000
  );

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;   // standard UX approximation
  const year = 365 * day;

  if (diffSeconds >= year) {
    const years = Math.floor(diffSeconds / year);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }

  if (diffSeconds >= month) {
    const months = Math.floor(diffSeconds / month);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  if (diffSeconds >= week) {
    const weeks = Math.floor(diffSeconds / week);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  if (diffSeconds >= day) {
    const days = Math.floor(diffSeconds / day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  if (diffSeconds >= hour) {
    const hours = Math.floor(diffSeconds / hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  if (diffSeconds >= minute) {
    const minutes = Math.floor(diffSeconds / minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  return "just now";
}
