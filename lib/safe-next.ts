/** Only allow same-site relative paths, never "//host" or absolute URLs. */
export function safeNextPath(next: string | null): string | null {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}
