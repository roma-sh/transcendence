declare global {
  interface Window {
    __API_KEY__?: string;
  }
}

export function apiHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    'x-api-key': window.__API_KEY__ || '',
    ...extra,
  };
}
