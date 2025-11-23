export function compareValues(
  a: unknown,
  b: unknown,
  type: 'number' | 'date' | 'string' = 'string'
): number {
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  switch (type) {
    case 'number':
      return Number(a) - Number(b);
    case 'date':
      return new Date(a as string | number | Date).getTime() - new Date(b as string | number | Date).getTime();
    default:
      return String(a).localeCompare(String(b));
  }
}

