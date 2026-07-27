export function cn(...values: readonly (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ");
}

/** "01", "02" … used by the section rail. */
export function ordinal(index: number): string {
  return String(index + 1).padStart(2, "0");
}
