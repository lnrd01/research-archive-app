export default async function searchAPI(query) {
  if (!query || !query.trim()) return [];

  const baseUrl = process.env.REACT_APP_CORE_API_URL || "https://api.core.ac.uk/v3";
  const key     = process.env.REACT_APP_CORE_API_KEY || "";

  try {
    const endpoint = `${baseUrl}/search/works?q=${encodeURIComponent(query)}&limit=20`;

    const headers = { "Content-Type": "application/json" };
    if (key) headers["Authorization"] = `Bearer ${key}`;

    const resp = await fetch(endpoint, { headers });

    if (!resp.ok) throw new Error(`CORE API error ${resp.status}`);

    const data = await resp.json();
    const results = data.results ?? [];

    if (results.length === 0) throw new Error("empty");

    return results.map((item) => ({
      id:       item.id,
      title:    item.title ?? item.displayTitle ?? "Untitled",
      authors:  Array.isArray(item.authors)
                  ? item.authors.map((a) => a.name ?? a).filter(Boolean)
                  : [],
      year:     item.yearPublished
                  ?? (item.publishedDate ? String(item.publishedDate).slice(0, 4) : null),
      abstract: item.abstract ?? "",
      url:      item.links?.[0]?.url ?? item.downloadUrl ?? null,
      source:   item.publisher ?? item.journals?.[0]?.title ?? null,
    }));

  } catch (coreErr) {
    console.warn("CORE API failed, falling back to OpenAlex:", coreErr.message);
  }

  try {
    const url =
      `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=20&mailto=app@acadexia.com`;

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`OpenAlex error ${resp.status}`);

    const data = await resp.json();
    const results = data.results ?? [];

    return results.map((item) => ({
      id:       item.id,
      title:    item.title ?? "Untitled",
      authors:  (item.authorships ?? [])
                  .slice(0, 5)
                  .map((a) => a.author?.display_name)
                  .filter(Boolean),
      year:     item.publication_year ? String(item.publication_year) : null,
      abstract: item.abstract_inverted_index
                  ? rebuildAbstract(item.abstract_inverted_index)
                  : "",
      url:      item.open_access?.oa_url
                  ?? item.primary_location?.landing_page_url
                  ?? null,
      source:   item.primary_location?.source?.display_name ?? null,
    }));

  } catch (alexErr) {
    console.error("OpenAlex fallback also failed:", alexErr);
    return [];
  }
}

function rebuildAbstract(invertedIndex) {
  try {
    const words = [];
    for (const [word, positions] of Object.entries(invertedIndex)) {
      for (const pos of positions) words[pos] = word;
    }
    return words.filter(Boolean).join(" ");
  } catch {
    return "";
  }
}