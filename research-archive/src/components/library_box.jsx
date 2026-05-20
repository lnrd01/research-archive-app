import { useState } from "react";
import "./library_box.css";
import {
  NAV_TABS,
  TIME_FILTERS,
  ARTICLE_TYPES,
  SAMPLE_ARTICLES,
  INITIAL_READING_LISTS,
  filterArticles,
} from "./acadexiaData.js";

// ─────────────────────────────────────────────
//  SVG ICONS
// ─────────────────────────────────────────────

function BookIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function BookmarkIcon({ filled }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M16 4 L28 28 L16 22 L4 28 Z" fill="white" opacity="0.9" />
      <path d="M10 10 L22 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────
//  REFINE RESULTS SIDEBAR
// ─────────────────────────────────────────────

function RefinePanel({ timeFilter, setTimeFilter, articleType, setArticleType, sortBy, setSortBy }) {
  return (
    <div className="refine-panel">
      <div className="refine-panel__section">
        <div className="refine-panel__heading">Refine Results</div>
        {TIME_FILTERS.map((f) => (
          <label key={f} className="refine-panel__option">
            <input
              type="radio"
              name="time"
              checked={timeFilter === f}
              onChange={() => setTimeFilter(f)}
            />
            <span className={`refine-panel__option-label ${timeFilter === f ? "refine-panel__option-label--active" : ""}`}>
              {f}
            </span>
          </label>
        ))}
      </div>

      <div className="refine-panel__section">
        <div className="refine-panel__heading">Article type</div>
        {ARTICLE_TYPES.map((t) => (
          <label key={t} className="refine-panel__option">
            <input
              type="radio"
              name="type"
              checked={articleType === t}
              onChange={() => setArticleType(t)}
            />
            <span className={`refine-panel__option-label ${articleType === t ? "refine-panel__option-label--active" : ""}`}>
              {t}
            </span>
          </label>
        ))}
      </div>

      <div className="refine-panel__section">
        <div className="refine-panel__heading">Sort by</div>
        {["Sort by relevance", "Sort by date"].map((s) => (
          <label key={s} className="refine-panel__option">
            <input
              type="radio"
              name="sort"
              checked={sortBy === s}
              onChange={() => setSortBy(s)}
            />
            <span className={`refine-panel__option-label ${sortBy === s ? "refine-panel__option-label--active" : ""}`}>
              {s}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  ARTICLE CARD
// ─────────────────────────────────────────────

function ArticleCard({ article, onSaveToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="article-card">
      <div className="article-card__icon">
        <BookIcon size={24} />
      </div>

      <div className="article-card__info">
        <div className="article-card__title">{article.title}</div>
        <div className="article-card__meta">
          {article.authors} · {article.year} ·{" "}
          <span className="article-card__meta-type">{article.type}</span>
        </div>
      </div>

      <div className="article-card__actions">
        <button
          className={`article-card__icon-btn ${article.saved ? "article-card__icon-btn--saved" : ""}`}
          onClick={() => onSaveToggle(article.id)}
        >
          <BookmarkIcon filled={article.saved} />
        </button>
        <button className="article-card__icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <DotsIcon />
        </button>
      </div>

      {menuOpen && (
        <div className="dropdown-menu">
          {["View Details", "Add to List", "Archive", "Remove"].map((opt) => (
            <button
              key={opt}
              className={`dropdown-menu__item ${opt === "Remove" ? "dropdown-menu__item--danger" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────

export default function AcadexiaLibrary() {
  const [activeTab, setActiveTab]       = useState("My Library");
  const [search, setSearch]             = useState("");
  const [articles, setArticles]         = useState(SAMPLE_ARTICLES);
  const [timeFilter, setTimeFilter]     = useState("Any time");
  const [articleType, setArticleType]   = useState("Any type");
  const [sortBy, setSortBy]             = useState("Sort by relevance");
  const [readingLists, setReadingLists] = useState(INITIAL_READING_LISTS);
  const [selectedList, setSelectedList] = useState(null);
  const [listMenu, setListMenu]         = useState(null);
  const [creatingList, setCreatingList] = useState(false);
  const [newListName, setNewListName]   = useState("");
  const [renamingId, setRenamingId]     = useState(null);
  const [renameValue, setRenameValue]   = useState("");

  const handleSaveToggle = (id) =>
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, saved: !a.saved } : a)));

  const createList = () => {
    if (!newListName.trim()) return;
    setReadingLists((prev) => [...prev, { id: Date.now(), name: newListName.trim(), articles: [] }]);
    setNewListName("");
    setCreatingList(false);
  };

  const deleteList = (id) => { setReadingLists((prev) => prev.filter((l) => l.id !== id)); setListMenu(null); };

  const renameList = (id) => {
    setReadingLists((prev) => prev.map((l) => (l.id === id ? { ...l, name: renameValue } : l)));
    setRenamingId(null);
    setListMenu(null);
  };

  const filteredArticles = filterArticles(articles, search, timeFilter, articleType, sortBy);

  return (
    <div>
      {/* TOP NAV */}
      <nav className="top-nav">
        <div className="top-nav__logo">
          <LogoIcon />
          <span className="top-nav__logo-text">ACADEXIA</span>
        </div>
        <div className="top-nav__search-wrap">
          <span className="top-nav__search-icon"><SearchIcon /></span>
          <input
            className="top-nav__search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search My Library..."
          />
        </div>
        <div className="top-nav__actions">
          <button className="top-nav__action-btn">My Profile</button>
          <button className="top-nav__action-btn">Articles</button>
        </div>
      </nav>

      {/* SUB NAV */}
      <nav className="sub-nav">
        {NAV_TABS.map((tab) => (
          <button
            key={tab}
            className={`sub-nav__tab ${activeTab === tab ? "sub-nav__tab--active" : ""}`}
            onClick={() => { setActiveTab(tab); setSelectedList(null); }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* PAGE BODY */}
      <div className="page-body">

        {/* MY LIBRARY */}
        {activeTab === "My Library" && (
          <>
            <RefinePanel timeFilter={timeFilter} setTimeFilter={setTimeFilter} articleType={articleType} setArticleType={setArticleType} sortBy={sortBy} setSortBy={setSortBy} />
            <div className="content-area">
              <h2 className="content-area__title">My Library</h2>
              {filteredArticles.length === 0
                ? <p className="content-area__empty">No articles found.</p>
                : filteredArticles.map((a) => <ArticleCard key={a.id} article={a} onSaveToggle={handleSaveToggle} />)
              }
            </div>
          </>
        )}

        {/* MY READING LIST — list view */}
        {activeTab === "My Reading List" && !selectedList && (
          <div className="content-area">
            {creatingList ? (
              <div className="create-list-input-row">
                <input autoFocus className="create-list-input" value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") createList(); if (e.key === "Escape") setCreatingList(false); }}
                  placeholder="Reading list name..." />
                <button className="btn-primary" onClick={createList}>Create</button>
                <button className="btn-secondary" onClick={() => setCreatingList(false)}>Cancel</button>
              </div>
            ) : (
              <button className="create-list-btn" onClick={() => setCreatingList(true)}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Create new reading list...
              </button>
            )}

            {readingLists.map((list) => (
              <div key={list.id} style={{ position: "relative" }}>
                <div className="reading-list-card" onClick={() => setSelectedList(list)}>
                  <div className="reading-list-card__thumbnail" />
                  {renamingId === list.id
                    ? <input autoFocus className="rename-input" value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") renameList(list.id); if (e.key === "Escape") setRenamingId(null); }}
                        onClick={(e) => e.stopPropagation()} />
                    : <span className="reading-list-card__name">{list.name}</span>
                  }
                  <span className="reading-list-card__count">{list.articles.length} articles</span>
                  <button className="article-card__icon-btn"
                    onClick={(e) => { e.stopPropagation(); setListMenu(listMenu === list.id ? null : list.id); }}>
                    <DotsIcon />
                  </button>
                </div>
                {listMenu === list.id && (
                  <div className="dropdown-menu" style={{ top: 56 }}>
                    <button className="dropdown-menu__item" onClick={() => setListMenu(null)}>Pin</button>
                    <button className="dropdown-menu__item dropdown-menu__item--danger" onClick={() => deleteList(list.id)}>Delete</button>
                    <button className="dropdown-menu__item" onClick={() => { setRenamingId(list.id); setRenameValue(list.name); setListMenu(null); }}>Rename</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* MY READING LIST — detail view */}
        {activeTab === "My Reading List" && selectedList && (
          <>
            <RefinePanel timeFilter={timeFilter} setTimeFilter={setTimeFilter} articleType={articleType} setArticleType={setArticleType} sortBy={sortBy} setSortBy={setSortBy} />
            <div className="content-area">
              <div className="back-row">
                <button className="back-btn" onClick={() => setSelectedList(null)}>←</button>
                <h2 className="content-area__title" style={{ marginBottom: 0 }}>{selectedList.name}</h2>
              </div>
              {selectedList.articles.length === 0
                ? <p className="content-area__empty">No articles in this list yet.</p>
                : selectedList.articles.map((a) => <ArticleCard key={a.id} article={a} onSaveToggle={handleSaveToggle} />)
              }
            </div>
          </>
        )}

        {/* ARCHIVE */}
        {activeTab === "Archive" && (
          <>
            <RefinePanel timeFilter={timeFilter} setTimeFilter={setTimeFilter} articleType={articleType} setArticleType={setArticleType} sortBy={sortBy} setSortBy={setSortBy} />
            <div className="content-area">
              <h2 className="content-area__title">Archive</h2>
              {articles.filter((a) => !a.saved).map((a) => (
                <ArticleCard key={a.id} article={a} onSaveToggle={handleSaveToggle} />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}