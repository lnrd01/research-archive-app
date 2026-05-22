export const NAV_TABS = ["My Library", "My Reading List", "Archive"];

export const TIME_FILTERS = [
  "Any time",
  "Since 2026",
  "Since 2025",
  "Since 2024",
  "Since 2022",
  "Custom range...",
];

export const ARTICLE_TYPES = [
  "Any type",
  "Review Articles",
  "Research Articles",
  "Conference Papers",
  "Thesis",
];

// Reading lists start empty — articles are saved from the API
export const INITIAL_READING_LISTS = [
  { id: 1, name: "Your reading list #1", articles: [] },
  { id: 2, name: "Machine Learning Papers", articles: [] },
];

export function filterArticles(articles, search, timeFilter, articleType, sortBy) {
  return articles
    .filter((a) => {
      const title   = (a.title   ?? "").toLowerCase();
      const authors = Array.isArray(a.authors)
        ? a.authors.join(", ").toLowerCase()
        : (a.authors ?? "").toLowerCase();

      const matchSearch =
        !search.trim() ||
        title.includes(search.toLowerCase()) ||
        authors.includes(search.toLowerCase());

      const matchType =
        articleType === "Any type" || a.type === articleType;

      const year = parseInt(a.year, 10);
      const matchTime =
        timeFilter === "Any time" ||
        (timeFilter === "Since 2026" && year >= 2026) ||
        (timeFilter === "Since 2025" && year >= 2025) ||
        (timeFilter === "Since 2024" && year >= 2024) ||
        (timeFilter === "Since 2022" && year >= 2022);

      return matchSearch && matchType && matchTime;
    })
    .sort((a, b) =>
      sortBy === "Sort by date"
        ? (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0)
        : 0
    );
}