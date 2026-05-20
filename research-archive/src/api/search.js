// Search API wrapper for CORE Academic API v3
// Env vars (set in your .env file):
//   REACT_APP_SEARCH_API_URL  →  https://api.core.ac.uk/v3
//   REACT_APP_SEARCH_API_KEY  →  your CORE API key

export default async function searchAPI(query) {
  const baseUrl = process.env.REACT_APP_SEARCH_API_URL;
  const key     = process.env.REACT_APP_SEARCH_API_KEY;

  if (!query || !query.trim()) return [];

  // Dev fallback when env vars are missing
  if (!baseUrl || !key) {
    console.warn('Search API not configured. Returning mock results.');
    return [
      { id: 1, title: `Mock result for "${query}" #1`, authors: [], year: null, abstract: '', url: null, source: null },
      { id: 2, title: `Mock result for "${query}" #2`, authors: [], year: null, abstract: '', url: null, source: null },
    ];
  }

  try {
    const endpoint = `${baseUrl}/search/works?q=${encodeURIComponent(query)}&limit=10`;

    const resp = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`CORE API error ${resp.status}: ${txt}`);
    }

    const data = await resp.json();
    const results = data.results ?? [];

    // Normalize to a consistent shape for the UI
    return results.map((item) => ({
      id:       item.id,
      title:    item.title ?? item.displayTitle ?? 'Untitled',
      authors:  Array.isArray(item.authors)
                  ? item.authors.map((a) => a.name ?? a).filter(Boolean)
                  : [],
      year:     item.yearPublished ?? item.publishedDate?.slice(0, 4) ?? null,
      abstract: item.abstract ?? '',
      url:      item.links?.[0]?.url ?? item.downloadUrl ?? null,
      source:   item.publisher ?? item.journals?.[0]?.title ?? null,
    }));

  } catch (err) {
    console.error('searchAPI error:', err);
    return [];
  }
}