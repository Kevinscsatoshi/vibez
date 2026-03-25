function normalizeConfiguredOrigin(value: string): string | null {
  const sanitized = value
    .replace(/\\n|\\r|\\t/g, "")
    .replace(/\s+/g, "")
    .replace(/\/+$/, "");

  if (!sanitized) return null;

  try {
    const url = new URL(sanitized);
    return url.origin;
  } catch {
    return null;
  }
}

export function getAppOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) {
    const normalized = normalizeConfiguredOrigin(configured);
    if (normalized) return normalized;
  }
  return new URL(request.url).origin;
}
