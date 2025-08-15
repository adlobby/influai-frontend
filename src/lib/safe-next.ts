// src/lib/safe-next.ts
export function getSafeNext(raw: string | null | undefined, fallback = "/app") {
  try {
    if (!raw) return fallback;
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin) return fallback;
    const path = url.pathname + url.search + url.hash;
    return path || fallback;
  } catch {
    return fallback;
  }
}
