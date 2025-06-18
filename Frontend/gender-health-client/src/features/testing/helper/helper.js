export function formatNumberWithDot(number) {
  if (number === undefined || number === null || isNaN(Number(number))) return "0";
  return Number(number)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
