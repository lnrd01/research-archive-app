import AcadexiaLibrary from './library_box.jsx';

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

export const SAMPLE_ARTICLES = [
  {
    id: 1,
    title: "The Role of Neuroplasticity in Long-Term Memory Formation",
    authors: "Rivera, M., Chen, L., Patel, A.",
    year: 2025,
    type: "Research Articles",
    saved: false,
  },
  {
    id: 2,
    title: "Advancements in CRISPR-Based Gene Editing for Rare Diseases",
    authors: "Thompson, K., Osei, R.",
    year: 2024,
    type: "Review Articles",
    saved: true,
  },
  {
    id: 3,
    title: "Quantum Entanglement and Its Applications in Cryptography",
    authors: "Nakamura, Y., Fernandez, J.",
    year: 2026,
    type: "Conference Papers",
    saved: false,
  },
  {
    id: 4,
    title: "Social Media Algorithms and Their Effect on Political Polarization",
    authors: "Williams, S., Gupta, P., Kofi, A.",
    year: 2024,
    type: "Thesis",
    saved: true,
  },
  {
    id: 5,
    title: "Biodiversity Loss in Tropical Rainforests: A 20-Year Analysis",
    authors: "Santos, E., Müller, H.",
    year: 2022,
    type: "Research Articles",
    saved: false,
  },
];

export const INITIAL_READING_LISTS = [
  {
    id: 1,
    name: "Your reading list #1",
    articles: SAMPLE_ARTICLES.slice(0, 4),
  },
  {
    id: 2,
    name: "Machine Learning Papers",
    articles: SAMPLE_ARTICLES.slice(1, 3),
  },
];

// --- Filter Logic ---

/**
 * Filters and sorts an array of articles based on user selections.
 *
 * @param {Array}  articles     - Full list of article objects
 * @param {string} search       - Search query string
 * @param {string} timeFilter   - Selected time filter label
 * @param {string} articleType  - Selected article type label
 * @param {string} sortBy       - Selected sort option label
 * @returns {Array} Filtered and sorted articles
 */
export function filterArticles(articles, search, timeFilter, articleType, sortBy) {
  return articles
    .filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.authors.toLowerCase().includes(search.toLowerCase());

      const matchType =
        articleType === "Any type" || a.type === articleType;

      const matchTime =
        timeFilter === "Any time" ||
        (timeFilter === "Since 2026" && a.year >= 2026) ||
        (timeFilter === "Since 2025" && a.year >= 2025) ||
        (timeFilter === "Since 2024" && a.year >= 2024) ||
        (timeFilter === "Since 2022" && a.year >= 2022);

      return matchSearch && matchType && matchTime;
    })
    .sort((a, b) => (sortBy === "Sort by date" ? b.year - a.year : 0));
}