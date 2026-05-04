export function shortAddress(value?: string) {
  if (!value) return "Not connected";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function formatDateTime(value: bigint | number) {
  const timestamp = typeof value === "bigint" ? Number(value) : value;
  return new Date(timestamp * 1000).toLocaleString();
}
