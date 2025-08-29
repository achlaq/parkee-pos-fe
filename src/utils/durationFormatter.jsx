export function formatDuration(minutes = 0) {
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = minutes % 60;

  return `${days} days ${hours} hours ${mins} minutes`;
}