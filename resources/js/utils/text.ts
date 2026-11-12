/** Capitalizes the first letter of every word as the user types, e.g. "juan dela cruz" → "Juan Dela Cruz". */
export function capitalizeWords(value: string): string {
  return value.replace(/(^|[\s\-'.])(\p{L})/gu, (_m, sep: string, ch: string) => sep + ch.toUpperCase());
}

export const NA_HINT = 'Type N/A if none';