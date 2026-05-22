import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./components/profile";
import SidePanel from "./components/sidePanel";
import HomePage from "./components/Homepage";
import AcadexiaLibrary from "./components/library_box";
import profileImg from "./assets/profile-acc.png";
import acadexiaLogo from "./assets/acadexia_logo.png";
import { openProfile } from "./store/uiSlice";
import searchAPI from "./api/search";

function parseYear(val) {
  if (!val) return null;
  const n = parseInt(String(val), 10);
  return isNaN(n) ? null : n;
}

// ARTICLE PAGE //
function ArticlesPage({
  searchValue, setSearchValue, handleSearch,
  loading, hasSearched, searchResults,
  user, handleOpenLogin, navigate,
  timeFilter, setTimeFilter,
  typeFilter, setTypeFilter,
  sortFilter, setSortFilter,
  savedArticles, onSaveToggle,
}) {
  const savedIds = new Set(savedArticles.map((a) => a.id ?? a.title));

  const filteredResults = useMemo(() => {
    let filtered = [...searchResults];
    const currentYear = new Date().getFullYear();

    if (timeFilter === "Since 2026") {
      filtered = filtered.filter((r) => { const y = parseYear(r.year); return y !== null && y >= 2026; });
    } else if (timeFilter === "Since 2024") {
      filtered = filtered.filter((r) => { const y = parseYear(r.year); return y !== null && y >= 2024; });
    } else if (timeFilter === "Since 2022") {
      filtered = filtered.filter((r) => { const y = parseYear(r.year); return y !== null && y >= 2022; });
    } else if (typeof timeFilter === "object" && (timeFilter.from || timeFilter.to)) {
      const from = timeFilter.from ? parseInt(timeFilter.from, 10) : 0;
      const to = timeFilter.to ? parseInt(timeFilter.to, 10) : currentYear;
      filtered = filtered.filter((r) => { const y = parseYear(r.year); return y !== null && y >= from && y <= to; });
    }

    if (typeFilter !== "Any type") {
      const typeKeywords = {
        "Review Articles": ["review", "meta-analysis", "literature review", "systematic"],
        "Research Articles": ["research", "study", "investigation", "analysis", "experiment", "findings", "paper"],
        "Conference Papers": ["conference", "proceedings", "symposium", "workshop", "congress"],
        "Thesis": ["thesis", "dissertation", "doctoral", "graduate", "master"],
      };
      const keywords = typeKeywords[typeFilter] || [];
      filtered = filtered.filter((r) => {
        const text = `${r.title ?? ""} ${r.abstract ?? ""}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });
    }

    if (sortFilter === "Sort by date") {
      filtered = [...filtered].sort((a, b) => {
        const yA = parseYear(a.year) ?? 0;
        const yB = parseYear(b.year) ?? 0;
        return yB - yA;
      });
    }

    return filtered;
  }, [searchResults, timeFilter, typeFilter, sortFilter]);

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.navLogo}>
          <img src={acadexiaLogo} alt="Acadexia logo" style={styles.logoIcon} />
          <span style={styles.logoText}>ACADEXIA</span>
        </div>

        <form style={styles.navSearchForm} onSubmit={handleSearch}>
          <span style={styles.searchIcon} aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15.5 15.5M17 10.5C17 14.09 14.09 17 10.5 17C6.91 17 4 14.09 4 10.5C4 6.91 6.91 4 10.5 4C14.09 4 17 6.91 17 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <input
            style={styles.navSearchInput}
            type="text"
            placeholder="Search for articles...."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        <div style={styles.navRight}>
          {user.username !== "Guest" ? (
            <button type="button" style={styles.userBadge} onClick={handleOpenLogin}>
              <img src={user.image} alt="Avatar" style={styles.userAvatar} />
              {user.username}
            </button>
          ) : (
            <button type="button" style={styles.loginButton} onClick={handleOpenLogin}>Log In</button>
          )}
        </div>
      </div>

      {/* TAB BAR */}
      <div style={styles.tabBar}>
        <div style={styles.tabLeft}>
          <span style={styles.activeTab}>Articles</span>
        </div>
        <div style={styles.tabRight}>
          <button style={styles.tabBtn} onClick={() => navigate("/")}> Home</button>
          <button style={styles.tabBtn} onClick={() => navigate("/library")}> My Library</button>
          <button style={styles.tabBtn} onClick={handleOpenLogin}> My Profile</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainArea}>
        <div style={styles.sidebarWrapper}>
          <SidePanel
            selectedTime={timeFilter}
            selectedType={typeFilter}
            selectedSort={sortFilter}
            onTimeChange={setTimeFilter}
            onTypeChange={setTypeFilter}
            onSortChange={setSortFilter}
          />
        </div>

        <div style={styles.resultsWrapper}>
          {!hasSearched && !loading && (
            <div style={styles.emptyMessage}>Search millions of open-access academic articles powered by OpenAlex.</div>
          )}
          {loading && <div style={styles.emptyMessage}>Searching…</div>}
          {!loading && hasSearched && searchResults.length === 0 && (
            <div style={styles.emptyMessage}>No results found. Try a different search term.</div>
          )}
          {!loading && hasSearched && searchResults.length > 0 && filteredResults.length === 0 && (
            <div style={styles.emptyMessage}>
              No results match your current filters.
              <br /><span style={{ fontSize: "12px", color: "#999" }}>Try selecting "Any time" or "Any type" to see all results.</span>
            </div>
          )}
          {!loading && hasSearched && filteredResults.length > 0 && (
            <div>
              <h2 style={styles.resultsHeading}>Search results for "{searchValue}"</h2>
              <p style={styles.resultsCount}>
                About {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                {filteredResults.length !== searchResults.length && (
                  <span style={{ color: "#999", fontSize: "12px" }}>{" "}(filtered from {searchResults.length})</span>
                )}
              </p>
              <ul style={styles.cardList}>
                {filteredResults.map((r) => {
                  const isSaved = savedIds.has(r.id ?? r.title);
                  return (
                    <li key={r.id ?? r.title} style={styles.card}>
                      <div style={styles.cardIconBox}>
                        <span style={styles.cardIconEmoji}>📖</span>
                      </div>
                      <div style={styles.cardBody}>
                        <div style={styles.cardTitle}>
                          {r.url ? (
                            <a href={r.url} target="_blank" rel="noreferrer" style={styles.cardLink}>{r.title}</a>
                          ) : r.title}
                        </div>
                        {r.authors?.length > 0 && (
                          <div style={styles.cardMeta}>
                            {r.authors.slice(0, 3).join(", ")}{r.authors.length > 3 ? " et al." : ""}
                            {r.year ? ` · ${r.year}` : ""}
                          </div>
                        )}
                        {r.source && <div style={{ ...styles.cardMeta, fontStyle: "italic" }}>{r.source}</div>}
                        {r.abstract && (
                          <p style={styles.cardAbstract}>
                            {r.abstract.length > 220 ? r.abstract.slice(0, 220) + "…" : r.abstract}
                          </p>
                        )}
                      </div>
                      <div style={styles.cardActions}>
                        <button
                          style={{
                            ...styles.iconBtn,
                            color: isSaved ? "#1a3a6e" : "#aab4c8",
                          }}
                          title={isSaved ? "Remove from Library" : "Save to Library"}
                          onClick={() => onSaveToggle(r)}
                        >
                          {isSaved ? "🔖" : "🔖"}
                          <span style={{
                            display: "block",
                            fontSize: "9px",
                            color: isSaved ? "#1a3a6e" : "#aab4c8",
                            marginTop: "2px",
                            fontWeight: isSaved ? "700" : "400",
                          }}>
                            {isSaved ? "Saved" : "Save"}
                          </span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [user, setUser] = useState({ username: "Guest", email: "--", image: profileImg });

  const [timeFilter, setTimeFilter] = useState("Any time");
  const [typeFilter, setTypeFilter] = useState("Any type");
  const [sortFilter, setSortFilter] = useState("Sort by relevance");

  // Global saved articles — shared between Articles page and Library
  const [savedArticles, setSavedArticles] = useState(() => {
    try {
      const stored = localStorage.getItem("lib_saved_articles");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const handleSaveToggle = (article) => {
    setSavedArticles((prev) => {
      const key = article.id ?? article.title;
      const exists = prev.find((a) => (a.id ?? a.title) === key);
      const next = exists
        ? prev.filter((a) => (a.id ?? a.title) !== key)
        : [...prev, article];
      localStorage.setItem("lib_saved_articles", JSON.stringify(next));
      return next;
    });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = async (input) => {
    const query = typeof input === "string" ? input : searchValue;
    if (input && typeof input.preventDefault === "function") input.preventDefault();
    if (!query.trim()) return;
    setSearchValue(query);
    setLoading(true);
    setHasSearched(true);
    setTimeFilter("Any time");
    setTypeFilter("Any type");
    setSortFilter("Sort by relevance");
    const results = await searchAPI(query);
    setSearchResults(results ?? []);
    setLoading(false);
    navigate("/articles");
  };

  const handleOpenLogin = () => { dispatch(openProfile()); navigate("/profile"); };
  const handleLoginSuccess = (loggedUser) => setUser(loggedUser);
  const handleLogout = () => setUser({ username: "Guest", email: "--", image: profileImg });

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage onSearch={handleSearch} user={user} onOpenProfile={handleOpenLogin} />}
      />
      <Route
        path="/articles"
        element={
          <ArticlesPage
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            handleSearch={handleSearch}
            loading={loading}
            hasSearched={hasSearched}
            searchResults={searchResults}
            user={user}
            handleOpenLogin={handleOpenLogin}
            navigate={navigate}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            sortFilter={sortFilter}
            setSortFilter={setSortFilter}
            savedArticles={savedArticles}
            onSaveToggle={handleSaveToggle}
          />
        }
      />
      <Route
        path="/library"
        element={<AcadexiaLibrary savedArticles={savedArticles} onSaveToggle={handleSaveToggle} />}
      />
      <Route
        path="/profile"
        element={<Profile user={user} onLogin={handleLoginSuccess} onLogout={handleLogout} />}
      />
    </Routes>
  );
}

/* ============================================================
   STYLES
   ============================================================ */
const styles = {
  page: { minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#f5f5f8", fontFamily: "'Segoe UI', sans-serif", boxSizing: "border-box" },
  navbar: { width: "100%", backgroundColor: "#0d1b3e", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", boxSizing: "border-box", gap: "16px" },
  navLogo: { display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 },
  logoIcon: { width: "28px", height: "28px", objectFit: "contain" },
  logoText: { fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: "400", letterSpacing: "0.12em", color: "rgba(200,215,255,0.95)" },
  navSearchForm: { flex: 1, maxWidth: "540px", display: "flex", alignItems: "center", backgroundColor: "#ffffff", borderRadius: "999px", padding: "8px 16px", gap: "8px" },
  searchIcon: { fontSize: "14px", color: "#888" },
  navSearchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px", color: "#333", backgroundColor: "transparent" },
  navRight: { flexShrink: 0 },
  loginButton: { padding: "8px 18px", borderRadius: "999px", border: "1px solid #ffffff", background: "transparent", color: "#ffffff", cursor: "pointer", fontSize: "14px" },
  userBadge: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: "14px" },
  userAvatar: { width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" },
  tabBar: { width: "100%", backgroundColor: "#dde3f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxSizing: "border-box", borderBottom: "1px solid #c5cfe0" },
  tabLeft: { display: "flex", alignItems: "center" },
  activeTab: { fontSize: "15px", fontWeight: "600", color: "#1a1a2e", padding: "12px 4px", borderBottom: "2.5px solid #1a1a2e", cursor: "pointer", display: "inline-block" },
  tabRight: { display: "flex", gap: "16px", alignItems: "center" },
  tabBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "13.5px", color: "#444", padding: "10px 0", display: "flex", alignItems: "center", gap: "6px" },
  mainArea: { display: "flex", flex: 1, width: "100%" },
  sidebarWrapper: { width: "240px", flexShrink: 0, backgroundColor: "#ffffff", borderRight: "1px solid #e0e0e0" },
  resultsWrapper: { flex: 1, padding: "24px 28px", boxSizing: "border-box" },
  emptyMessage: { marginTop: "40px", color: "#666", textAlign: "center", fontSize: "14px", lineHeight: "1.8" },
  resultsHeading: { fontSize: "22px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 4px 0" },
  resultsCount: { fontSize: "13px", color: "#666", marginBottom: "20px" },
  cardList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" },
  card: { backgroundColor: "#ffffff", border: "1px solid #dde3ef", borderRadius: "10px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "16px" },
  cardIconBox: { width: "56px", height: "56px", backgroundColor: "#e8ecf4", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardIconEmoji: { fontSize: "24px" },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: "15px", fontWeight: "700", color: "#0f172a", marginBottom: "5px", lineHeight: "1.4" },
  cardLink: { color: "#1a3a6e", textDecoration: "none" },
  cardMeta: { fontSize: "12.5px", color: "#64748b", marginBottom: "3px" },
  cardAbstract: { fontSize: "12.5px", color: "#475569", lineHeight: "1.6", marginTop: "6px", marginBottom: 0 },
  cardActions: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 },
  iconBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "18px", padding: "4px", display: "flex", flexDirection: "column", alignItems: "center" },
};

export default App;