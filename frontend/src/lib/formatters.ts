export function formatUnderscoreLabel(value: string): string {
  return value.replace(/_/g, ' ');
}

export function formatDate(value: string | null | undefined, fallback = 'TBD'): string {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString();
}

export function formatBudget(
  budgetMin: number | null | undefined,
  budgetMax: number | null | undefined,
  currency: string
): string {
  if (budgetMin == null) return 'N/A';
  return `${currency} ${budgetMin}-${budgetMax ?? budgetMin}`;
}

export function parseCommaSeparatedList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
