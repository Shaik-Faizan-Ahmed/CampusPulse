// API helper — all paths are relative so they go through Next.js rewrites → backend at :5000
// The rewrite in next.config.js requires Accept: application/json to forward to :5000
export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      'Accept': 'application/json',
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(options.headers || {}),
    },
  });
  return res;
}

export function getCatEmoji(category: string) {
  const map: Record<string, string> = {
    Technical: '💻',
    'Non-Technical': '🎭',
    Sports: '⚽',
    Cultural: '🎨',
    Workshop: '🔧',
    Other: '📌',
  };
  return map[category] || '📌';
}

export function getCatClass(category: string) {
  const map: Record<string, string> = {
    Technical: 'tech',
    'Non-Technical': 'non',
    Sports: 'sports',
    Cultural: 'cultural',
    Workshop: 'workshop',
    Other: 'other',
  };
  return map[category] || 'other';
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleString('en-IN', opts || { dateStyle: 'medium', timeStyle: 'short' });
}
