import { useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./components/profile";
import SidePanel from "./components/sidePanel";
import profileImg from "./assets/profile-acc.png";
import { openProfile } from "./store/uiSlice";
import searchAPI from "./api/search";

function App() {
  const [searchValue, setSearchValue]     = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [hasSearched, setHasSearched]     = useState(false);
  const [user, setUser] = useState({ username: "Guest", email: "--", image: profileImg });

  // --- Filter states (controlled by SidePanel) ---
  const [timeFilter, setTimeFilter] = useState("Any time");
  const [typeFilter, setTypeFilter] = useState("Any type");
  const [sortFilter, setSortFilter] = useState("Sort by relevance");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Search handler ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setLoading(true);
    setHasSearched(true);
    const results = await searchAPI(searchValue);
    setSearchResults(results ?? []);
    setLoading(false);
  };

  // --- Filter + Sort function ---
  function getFilteredResults() {
    let filtered = [...searchResults];

    // 1. TIME FILTER
    const currentYear = new Date().getFullYear();

    if (timeFilter === "Since 2026") {
      // Show articles published in 2026 or later
      filtered = filtered.filter((r) => {
        const y = parseInt(r.year);
        return !isNaN(y) && y >= 2026;
      });

    } else if (timeFilter === "Since 2024") {
      // Show articles published in 2024 or later
      filtered = filtered.filter((r) => {
        const y = parseInt(r.year);
        return !isNaN(y) && y >= 2024;
      });

    } else if (timeFilter === "Since 2022") {
      // Show articles published in 2022 or later
      filtered = filtered.filter((r) => {
        const y = parseInt(r.year);
        return !isNaN(y) && y >= 2022;
      });

    } else if (typeof timeFilter === "object" && (timeFilter.from || timeFilter.to)) {
      // Custom range: show articles between from year and to year
      const from = timeFilter.from ? parseInt(timeFilter.from) : 0;
      const to   = timeFilter.to   ? parseInt(timeFilter.to)   : currentYear;
      filtered = filtered.filter((r) => {
        const y = parseInt(r.year);
        return !isNaN(y) && y >= from && y <= to;
      });
    }
    // "Any time" = no filter, show everything

    // ========================
    // 2. ARTICLE TYPE FILTER
    // ========================
    if (typeFilter !== "Any type") {
      const typeKeywords = {
        "Review Articles":   ["review", "systematic review", "meta-analysis", "literature review"],
        "Research Articles": ["research", "study", "investigation", "analysis", "experiment", "findings"],
        "Conference Papers": ["conference", "proceedings", "symposium", "workshop", "congress"],
        "Thesis":            ["thesis", "dissertation", "doctoral", "graduate"],
      };

      const keywords = typeKeywords[typeFilter] || [];

      filtered = filtered.filter((r) => {
        // Combine title + abstract into one text to search
        const text = `${r.title ?? ""} ${r.abstract ?? ""}`.toLowerCase();
        // Keep this article if ANY keyword is found in the text
        return keywords.some((word) => text.includes(word));
      });
    }

    // ========================
    // 3. SORT
    // "Sort by date"     
    // "Sort by relevance" 
    // ========================
    if (sortFilter === "Sort by date") {
      // Use spread [...] to avoid mutating the original array
      filtered = [...filtered].sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA; // Newest first
      });
    }
    // Sort by relevance = do nothing, keep API order

    return filtered;
  }

  // Run the filter function to get what to display
  const filteredResults = getFilteredResults();

  const handleOpenLogin    = () => { dispatch(openProfile()); navigate("/profile"); };
  const handleLoginSuccess = (loggedUser) => setUser(loggedUser);
  const handleLogout       = () => setUser({ username: "Guest", email: "--", image: profileImg });

  return (
    <div style={styles.page}>

      {/* ============================
          TOP NAVBAR
      ============================== */}
      <div style={styles.navbar}>

        {/* Logo */}
        <div style={styles.navLogo}>
          <span style={styles.logoIcon}>✦</span>
          <span style={styles.logoText}>ACADEXIA</span>
        </div>

        {/* Search form */}
        <form style={styles.navSearchForm} onSubmit={handleSearch}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.navSearchInput}
            type="text"
            placeholder="Search for articles...."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        {/* User / Login */}
        <div style={styles.navRight}>
          {user.username !== "Guest" ? (
            <button type="button" style={styles.userBadge} onClick={handleOpenLogin}>
              <img src={user.image} alt="Avatar" style={styles.userAvatar} />
              {user.username}
            </button>
          ) : (
            <button type="button" style={styles.loginButton} onClick={handleOpenLogin}>
              Log In
            </button>
          )}
        </div>

      </div>

      {/* ============================
          TAB BAR
      ============================== */}
      <div style={styles.tabBar}>
        <div style={styles.tabLeft}>
          <span style={styles.activeTab}>Articles</span>
        </div>
        <div style={styles.tabRight}>
          <button style={styles.tabBtn} onClick={handleOpenLogin}>🏠 My Profile</button>
          <button style={styles.tabBtn}>☆ My Library</button>
        </div>
      </div>

      {/* ============================
          MAIN CONTENT
      ============================== */}
      <div style={styles.mainArea}>

        {/* LEFT: SidePanel — pass filter handlers as props */}
        <div style={styles.sidebarWrapper}>
          <SidePanel
            onTimeChange={setTimeFilter}
            onTypeChange={setTypeFilter}
            onSortChange={setSortFilter}
          />
        </div>

        {/* RIGHT: Results */}
        <div style={styles.resultsWrapper}>

          {/* Before any search */}
          {!hasSearched && !loading && (
            <div style={styles.emptyMessage}>
              Search millions of open-access academic articles powered by CORE.
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div style={styles.emptyMessage}>Searching…</div>
          )}

          {/* API returned nothing */}
          {!loading && hasSearched && searchResults.length === 0 && (
            <div style={styles.emptyMessage}>
              No results found. Try a different search term.
            </div>
          )}

          {/* API has results but filters removed all of them */}
          {!loading && hasSearched && searchResults.length > 0 && filteredResults.length === 0 && (
            <div style={styles.emptyMessage}>
              No results match your current filters.
              <br />
              <span style={{ fontSize: "12px", color: "#999" }}>
                Try selecting "Any time" or "Any type" to see all results.
              </span>
            </div>
          )}

          {/* Show results */}
          {!loading && hasSearched && filteredResults.length > 0 && (
            <div>

              {/* Heading */}
              <h2 style={styles.resultsHeading}>
                Search results for "{searchValue}"
              </h2>

              {/* Result count — shows filtered vs total */}
              <p style={styles.resultsCount}>
                About {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                {/* Show (filtered from X) only when filters are active */}
                {filteredResults.length !== searchResults.length && (
                  <span style={{ color: "#999", fontSize: "12px" }}>
                    {" "}(filtered from {searchResults.length})
                  </span>
                )}
              </p>

              {/* Article cards */}
              <ul style={styles.cardList}>
                {filteredResults.map((r) => (
                  <li key={r.id ?? r.title} style={styles.card}>

                    {/* Book icon box */}
                    <div style={styles.cardIconBox}>
                      <span style={styles.cardIconEmoji}>📖</span>
                    </div>

                    {/* Article content */}
                    <div style={styles.cardBody}>

                      {/* Title — clickable if URL exists */}
                      <div style={styles.cardTitle}>
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noreferrer" style={styles.cardLink}>
                            {r.title}
                          </a>
                        ) : r.title}
                      </div>

                      {/* Authors + year */}
                      {r.authors?.length > 0 && (
                        <div style={styles.cardMeta}>
                          {r.authors.slice(0, 3).join(", ")}
                          {r.authors.length > 3 ? " et al." : ""}
                          {r.year ? ` · ${r.year}` : ""}
                        </div>
                      )}

                      {/* Source / journal */}
                      {r.source && (
                        <div style={{ ...styles.cardMeta, fontStyle: "italic" }}>
                          {r.source}
                        </div>
                      )}

                      {/* Abstract preview */}
                      {r.abstract && (
                        <p style={styles.cardAbstract}>
                          {r.abstract.length > 220
                            ? r.abstract.slice(0, 220) + "…"
                            : r.abstract}
                        </p>
                      )}

                    </div>

                    {/* Bookmark + more options */}
                    <div style={styles.cardActions}>
                      <button style={styles.iconBtn} title="Bookmark">🔖</button>
                      <button style={styles.iconBtn} title="More options">⋮</button>
                    </div>

                  </li>
                ))}
              </ul>

            </div>
          )}

        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route
          path="/profile"
          element={
            <Profile
              user={user}
              onLogin={handleLoginSuccess}
              onLogout={handleLogout}
            />
          }
        />
      </Routes>

    </div>
  );
}

/* ============================
   STYLES
============================== */
const styles = {

  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f8",
    fontFamily: "'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },

  navbar: {
    width: "100%",
    backgroundColor: "#0d1b3e",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    boxSizing: "border-box",
    gap: "16px",
  },

  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },

  logoIcon: {
    fontSize: "22px",
    color: "#a0b4d6",
  },

  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "2px",
    color: "#ffffff",
  },

  navSearchForm: {
    flex: 1,
    maxWidth: "540px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "999px",
    padding: "8px 16px",
    gap: "8px",
  },

  searchIcon: {
    fontSize: "14px",
    color: "#888",
  },

  navSearchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "transparent",
  },

  navRight: {
    flexShrink: 0,
  },

  loginButton: {
    padding: "8px 18px",
    borderRadius: "999px",
    border: "1px solid #ffffff",
    background: "transparent",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  },

  userBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },

  userAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  tabBar: {
    width: "100%",
    backgroundColor: "#dde3f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    boxSizing: "border-box",
    borderBottom: "1px solid #c5cfe0",
  },

  tabLeft: {
    display: "flex",
    alignItems: "center",
  },

  activeTab: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1a1a2e",
    padding: "12px 4px",
    borderBottom: "2.5px solid #1a1a2e",
    cursor: "pointer",
    display: "inline-block",
  },

  tabRight: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },

  tabBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "13.5px",
    color: "#444",
    padding: "10px 0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  mainArea: {
    display: "flex",
    flex: 1,
    width: "100%",
  },

  sidebarWrapper: {
    width: "240px",
    flexShrink: 0,
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e0e0e0",
  },

  resultsWrapper: {
    flex: 1,
    padding: "24px 28px",
    boxSizing: "border-box",
  },

  emptyMessage: {
    marginTop: "40px",
    color: "#666",
    textAlign: "center",
    fontSize: "14px",
    lineHeight: "1.8",
  },

  resultsHeading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 4px 0",
  },

  resultsCount: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "20px",
  },

  cardList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #dde3ef",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
  },

  cardIconBox: {
    width: "56px",
    height: "56px",
    backgroundColor: "#e8ecf4",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardIconEmoji: {
    fontSize: "24px",
  },

  cardBody: {
    flex: 1,
  },

  cardTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "5px",
    lineHeight: "1.4",
  },

  cardLink: {
    color: "#1a3a6e",
    textDecoration: "none",
  },

  cardMeta: {
    fontSize: "12.5px",
    color: "#64748b",
    marginBottom: "3px",
  },

  cardAbstract: {
    fontSize: "12.5px",
    color: "#475569",
    lineHeight: "1.6",
    marginTop: "6px",
    marginBottom: 0,
  },

  cardActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },

  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#1a3a6e",
    padding: "4px",
  },

};

export default App;