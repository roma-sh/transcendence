declare global {
  interface Window {
    __API_KEY__?: string;
  }
}

export function apiHeaders(extra: Record<string, string> = {}): Record<string, string> {
	const key = (typeof window !== 'undefined' && window.__API_KEY__) || '';
	return {
	  'x-api-key': key,
	  ...extra,
	};
  }
