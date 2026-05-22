import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/library_box.css";
import acadexiaLogo from "../assets/acadexia_logo.png";
import {
  NAV_TABS,
  TIME_FILTERS,
  ARTICLE_TYPES,
  INITIAL_READING_LISTS,
  filterArticles,
} from "./acadexiaData.jsx";
// import logoConcept from "../assets/logo_concept.png";

function BookIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function BookmarkIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"} stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function LogoIcon() {
  return <img src={acadexiaLogo} alt="Acadexia logo" className="top-nav__logo-mark" />;
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ADD TO LIST FUNCTIONALITY //
function AddToListModal({ article, readingLists, onAddToList, onCreateAndAdd, onClose }) {
  const [newListName, setNewListName] = useState("");
  const [creating, setCreating] = useState(false);
  const [justAdded, setJustAdded] = useState(null); // list id that was just added

  const handleAdd = (list) => {
    const alreadyIn = list.articles.some((a) => (a.id ?? a.title) === (article.id ?? article.title));
    if (alreadyIn) return;
    onAddToList(list.id, article);
    setJustAdded(list.id);
    setTimeout(() => setJustAdded(null), 1500);
  };

  const handleCreate = () => {
    if (!newListName.trim()) return;
    onCreateAndAdd(newListName.trim(), article);
    setNewListName("");
    setCreating(false);
  };

  return (
    <div style={modal.backdrop} onClick={onClose}>
      <div style={modal.panel} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={modal.header}>
          <span style={modal.headerTitle}>Add to reading list</span>
          <button style={modal.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Article being added */}
        <div style={modal.articlePreview}>
          <div style={modal.articlePreviewIcon}><BookIcon size={18} /></div>
          <span style={modal.articlePreviewTitle} title={article.title}>
            {article.title?.length > 60 ? article.title.slice(0, 60) + "…" : article.title}
          </span>
        </div>

        <div style={modal.divider} />

        {/* Create new list inline */}
        {creating ? (
          <div style={modal.createRow}>
            <input
              autoFocus
              style={modal.createInput}
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setCreating(false); }}
              placeholder="Reading list name…"
            />
            <button style={modal.createConfirmBtn} onClick={handleCreate}>Create</button>
            <button style={modal.createCancelBtn} onClick={() => setCreating(false)}>Cancel</button>
          </div>
        ) : (
          <button style={modal.newListBtn} onClick={() => setCreating(true)}>
            <span style={modal.newListBtnIcon}><PlusIcon /></span>
            New reading list
          </button>
        )}

        {/* List of playlists */}
        <div style={modal.listScroll}>
          {readingLists.length === 0 && (
            <p style={modal.emptyHint}>No reading lists yet. Create one above!</p>
          )}
          {readingLists.map((list) => {
            const alreadyIn = list.articles.some((a) => (a.id ?? a.title) === (article.id ?? article.title));
            const added = justAdded === list.id;
            return (
              <button
                key={list.id}
                style={{
                  ...modal.listRow,
                  background: alreadyIn ? "rgba(26,46,110,0.07)" : "transparent",
                  cursor: alreadyIn ? "default" : "pointer",
                }}
                onClick={() => handleAdd(list)}
                disabled={alreadyIn}
              >
                <div style={modal.listRowThumb}>
                  <ListIcon />
                </div>
                <div style={modal.listRowInfo}>
                  <span style={modal.listRowName}>{list.name}</span>
                  <span style={modal.listRowCount}>{list.articles.length} article{list.articles.length !== 1 ? "s" : ""}</span>
                </div>
                <div style={{
                  ...modal.listRowCheck,
                  color: alreadyIn ? "#1a2e6e" : "#ccc",
                }}>
                  {alreadyIn ? <CheckIcon /> : added ? <CheckIcon /> : null}
                  {alreadyIn && <span style={modal.addedLabel}>Added</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const modal = {
  backdrop: {
    position: "fixed", inset: 0, background: "rgba(8,12,32,0.55)",
    backdropFilter: "blur(8px)", zIndex: 3000,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  panel: {
    width: 380, background: "#fff", borderRadius: 16,
    boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
    display: "flex", flexDirection: "column", overflow: "hidden",
    animation: "none",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 20px 12px",
  },
  headerTitle: { fontSize: 15, fontWeight: 700, color: "#0d1f5c" },
  closeBtn: {
    background: "none", border: "none", fontSize: 16, color: "#888",
    cursor: "pointer", lineHeight: 1, padding: 4,
  },
  articlePreview: {
    display: "flex", alignItems: "center", gap: 10,
    margin: "0 20px 12px", padding: "10px 12px",
    background: "#f0f4ff", borderRadius: 10,
  },
  articlePreviewIcon: { color: "#1a2e6e", flexShrink: 0 },
  articlePreviewTitle: { fontSize: 12.5, color: "#1a2e6e", fontWeight: 600, lineHeight: 1.4 },
  divider: { height: 1, background: "#e8ecf5", margin: "0 20px 8px" },
  newListBtn: {
    display: "flex", alignItems: "center", gap: 10,
    margin: "4px 20px 4px", padding: "10px 14px",
    background: "none", border: "1.5px dashed #b0bcd8",
    borderRadius: 10, cursor: "pointer", color: "#1a2e6e",
    fontSize: 13, fontWeight: 600, width: "calc(100% - 40px)",
  },
  newListBtnIcon: { display: "flex", alignItems: "center" },
  createRow: {
    display: "flex", gap: 6, alignItems: "center",
    margin: "4px 20px 4px", flexWrap: "wrap",
  },
  createInput: {
    flex: 1, minWidth: 0, padding: "8px 12px",
    border: "1.5px solid #1a2e6e", borderRadius: 8,
    fontSize: 13, outline: "none",
  },
  createConfirmBtn: {
    padding: "8px 14px", background: "#1a2e6e", color: "#fff",
    border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600,
  },
  createCancelBtn: {
    padding: "8px 12px", background: "none",
    border: "1px solid #ccc", borderRadius: 8, fontSize: 13, cursor: "pointer", color: "#666",
  },
  listScroll: {
    maxHeight: 280, overflowY: "auto",
    padding: "6px 20px 16px", display: "flex", flexDirection: "column", gap: 2,
  },
  listRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 12px", borderRadius: 10,
    border: "none", width: "100%", textAlign: "left",
    transition: "background 0.15s",
  },
  listRowThumb: {
    width: 38, height: 38, borderRadius: 8,
    background: "#e8ecf5", display: "flex",
    alignItems: "center", justifyContent: "center",
    color: "#1a2e6e", flexShrink: 0,
  },
  listRowInfo: { flex: 1, display: "flex", flexDirection: "column", gap: 2 },
  listRowName: { fontSize: 13.5, fontWeight: 600, color: "#0d1f5c" },
  listRowCount: { fontSize: 11.5, color: "#8899bb" },
  listRowCheck: { display: "flex", alignItems: "center", gap: 4, flexShrink: 0 },
  addedLabel: { fontSize: 11, fontWeight: 600, color: "#1a2e6e" },
  emptyHint: { fontSize: 13, color: "#aaa", textAlign: "center", padding: "16px 0" },
};

// SIDEBAR PANEL (FILTERS AND SORTING) //
function RefinePanel({ timeFilter, setTimeFilter, articleType, setArticleType, sortBy, setSortBy }) {
  return (
    <div className="refine-panel">
      <div className="refine-panel__section">
        <div className="refine-panel__heading">Refine Results</div>
        {TIME_FILTERS.map((f) => (
          <label key={f} className="refine-panel__option">
            <input type="radio" name="lib-time" checked={timeFilter === f} onChange={() => setTimeFilter(f)} />
            <span className={`refine-panel__option-label ${timeFilter === f ? "refine-panel__option-label--active" : ""}`}>{f}</span>
          </label>
        ))}
      </div>
      <div className="refine-panel__section">
        <div className="refine-panel__heading">Article type</div>
        {ARTICLE_TYPES.map((t) => (
          <label key={t} className="refine-panel__option">
            <input type="radio" name="lib-type" checked={articleType === t} onChange={() => setArticleType(t)} />
            <span className={`refine-panel__option-label ${articleType === t ? "refine-panel__option-label--active" : ""}`}>{t}</span>
          </label>
        ))}
      </div>
      <div className="refine-panel__section">
        <div className="refine-panel__heading">Sort by</div>
        {["Sort by relevance", "Sort by date"].map((s) => (
          <label key={s} className="refine-panel__option">
            <input type="radio" name="lib-sort" checked={sortBy === s} onChange={() => setSortBy(s)} />
            <span className={`refine-panel__option-label ${sortBy === s ? "refine-panel__option-label--active" : ""}`}>{s}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ARTICLE CARD SECTION //
function ArticleCard({ article, onSaveToggle, isSaved, readingLists, onAddToList, onCreateAndAdd, onRemoveFromList }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const authorsText = Array.isArray(article.authors)
    ? article.authors.slice(0, 3).join(", ") + (article.authors.length > 3 ? " et al." : "")
    : article.authors ?? "";

  const handleMenuOption = (opt) => {
    setMenuOpen(false);
    if (opt === "Add to List") setShowAddModal(true);
    if (opt === "Remove" && onRemoveFromList) onRemoveFromList(article);
  };

  return (
    <>
      <div className="article-card">
        <div className="article-card__icon"><BookIcon size={24} /></div>

        <div className="article-card__info">
          <div className="article-card__title">
            {article.url
              ? <a href={article.url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{article.title}</a>
              : article.title}
          </div>
          <div className="article-card__meta">
            {authorsText}{article.year ? ` · ${article.year}` : ""}
            {article.source ? <> · <em>{article.source}</em></> : null}
          </div>
        </div>

        <div className="article-card__actions">
          <button
            className={`article-card__icon-btn ${isSaved ? "article-card__icon-btn--saved" : ""}`}
            title={isSaved ? "Remove from Library" : "Save to Library"}
            onClick={() => onSaveToggle(article)}
          >
            <BookmarkIcon filled={isSaved} />
          </button>
          <button className="article-card__icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <DotsIcon />
          </button>
        </div>

        {menuOpen && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />
            <div className="dropdown-menu" style={{ zIndex: 100 }}>
              {["Add to List", "View Details", "Archive", "Remove"].map((opt) => (
                <button
                  key={opt}
                  className={`dropdown-menu__item ${opt === "Remove" ? "dropdown-menu__item--danger" : ""}`}
                  onClick={() => handleMenuOption(opt)}
                >
                  {opt === "Add to List" && <span style={{ marginRight: 6 }}>＋</span>}
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {showAddModal && (
        <AddToListModal
          article={article}
          readingLists={readingLists}
          onAddToList={onAddToList}
          onCreateAndAdd={onCreateAndAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}

// MAIN LIBRARY PAGE //
export default function AcadexiaLibrary({ savedArticles = [], onSaveToggle }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("My Library");
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("Any time");
  const [articleType, setArticleType] = useState("Any type");
  const [sortBy, setSortBy] = useState("Sort by relevance");

  const [readingLists, setReadingLists] = useState(INITIAL_READING_LISTS);
  const [selectedList, setSelectedList] = useState(null); // { id, name, articles }
  const [listMenu, setListMenu] = useState(null);
  const [creatingList, setCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const savedIds = new Set(savedArticles.map((a) => a.id ?? a.title));

  const displayArticles = filterArticles(savedArticles, search, timeFilter, articleType, sortBy);

  // List actions
  const createList = () => {
    if (!newListName.trim()) return;
    setReadingLists((prev) => [...prev, { id: Date.now(), name: newListName.trim(), articles: [] }]);
    setNewListName("");
    setCreatingList(false);
  };

  const deleteList = (id) => {
    setReadingLists((prev) => prev.filter((l) => l.id !== id));
    if (selectedList?.id === id) setSelectedList(null);
    setListMenu(null);
  };

  const renameList = (id) => {
    setReadingLists((prev) => prev.map((l) => l.id === id ? { ...l, name: renameValue } : l));
    if (selectedList?.id === id) setSelectedList((s) => ({ ...s, name: renameValue }));
    setRenamingId(null);
    setListMenu(null);
  };

  const handleAddToList = (listId, article) => {
    setReadingLists((prev) => {
      const next = prev.map((l) => {
        if (l.id !== listId) return l;
        const alreadyIn = l.articles.some((a) => (a.id ?? a.title) === (article.id ?? article.title));
        if (alreadyIn) return l;
        return { ...l, articles: [...l.articles, article] };
      });
      // Keep selectedList in sync if it's currently open
      if (selectedList?.id === listId) {
        const updated = next.find((l) => l.id === listId);
        if (updated) setSelectedList(updated);
      }
      return next;
    });
  };

  const handleCreateAndAdd = (name, article) => {
    const newList = { id: Date.now(), name, articles: [article] };
    setReadingLists((prev) => [...prev, newList]);
  };

  const handleRemoveFromList = (listId, article) => {
    setReadingLists((prev) => {
      const next = prev.map((l) =>
        l.id === listId
          ? { ...l, articles: l.articles.filter((a) => (a.id ?? a.title) !== (article.id ?? article.title)) }
          : l
      );
      const updated = next.find((l) => l.id === listId);
      if (selectedList?.id === listId && updated) setSelectedList(updated);
      return next;
    });
  };

  const liveSelectedList = selectedList
    ? readingLists.find((l) => l.id === selectedList.id) ?? null
    : null;

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
            placeholder="Filter saved articles..."
          />
        </div>
      </nav>

      {/* SUB NAV */}
      <nav className="sub-nav">
        <div className="sub-nav__tabs">
          {NAV_TABS.map((tab) => (
            <button
              key={tab}
              className={`sub-nav__tab ${activeTab === tab ? "sub-nav__tab--active" : ""}`}
              onClick={() => { setActiveTab(tab); setSelectedList(null); }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="sub-nav__actions">
          <button className="sub-nav__action-btn" onClick={() => navigate("/")}>Home</button>
          <button className="sub-nav__action-btn" onClick={() => navigate("/profile")}>My Profile</button>
          <button className="sub-nav__action-btn" onClick={() => navigate("/articles")}>Articles</button>
        </div>
      </nav>

      <div className="page-body">

        {/* ── MY LIBRARY ── */}
        {activeTab === "My Library" && (
          <>
            <RefinePanel timeFilter={timeFilter} setTimeFilter={setTimeFilter}
              articleType={articleType} setArticleType={setArticleType}
              sortBy={sortBy} setSortBy={setSortBy} />
            <div className="content-area">
              <h2 className="content-area__title">My Library</h2>
              {savedArticles.length === 0 && (
                <p className="content-area__empty">No saved articles yet. Bookmark articles from the search page to add them here.</p>
              )}
              {savedArticles.length > 0 && displayArticles.length === 0 && (
                <p className="content-area__empty">No saved articles match your filter.</p>
              )}
              {displayArticles.map((a) => (
                <ArticleCard
                  key={a.id ?? a.title}
                  article={a}
                  isSaved={savedIds.has(a.id ?? a.title)}
                  onSaveToggle={onSaveToggle}
                  readingLists={readingLists}
                  onAddToList={handleAddToList}
                  onCreateAndAdd={handleCreateAndAdd}
                />
              ))}
            </div>
          </>
        )}

        {/* ── MY READING LIST — playlist grid ── */}
        {activeTab === "My Reading List" && !liveSelectedList && (
          <div className="content-area">
            <h2 className="content-area__title">My Reading Lists</h2>

            {/* Create new list */}
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

            {readingLists.length === 0 && (
              <p className="content-area__empty">No reading lists yet. Create one above!</p>
            )}

            {readingLists.map((list) => (
              <div key={list.id} style={{ position: "relative" }}>
                <div className="reading-list-card" onClick={() => setSelectedList(list)}>
                  <div style={rlCard.thumb}>
                    {list.articles.length === 0
                      ? <span style={{ fontSize: 20, color: "#8899bb" }}>📚</span>
                      : list.articles.slice(0, 4).map((a, i) => (
                        <div key={i} style={rlCard.thumbCell}><BookIcon size={14} /></div>
                      ))
                    }
                  </div>

                  {renamingId === list.id
                    ? <input autoFocus className="rename-input" value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") renameList(list.id); if (e.key === "Escape") setRenamingId(null); }}
                      onClick={(e) => e.stopPropagation()} />
                    : (
                      <div style={rlCard.info}>
                        <span className="reading-list-card__name">{list.name}</span>
                        <span className="reading-list-card__count">{list.articles.length} article{list.articles.length !== 1 ? "s" : ""}</span>
                      </div>
                    )
                  }

                  <button className="article-card__icon-btn"
                    onClick={(e) => { e.stopPropagation(); setListMenu(listMenu === list.id ? null : list.id); }}>
                    <DotsIcon />
                  </button>
                </div>

                {listMenu === list.id && (
                  <>
                    <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setListMenu(null)} />
                    <div className="dropdown-menu" style={{ top: 56, zIndex: 100 }}>
                      <button className="dropdown-menu__item" onClick={() => { setRenamingId(list.id); setRenameValue(list.name); setListMenu(null); }}>Rename</button>
                      <button className="dropdown-menu__item dropdown-menu__item--danger" onClick={() => deleteList(list.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* MY READING LIST SECTION */}
        {activeTab === "My Reading List" && liveSelectedList && (
          <>
            <RefinePanel timeFilter={timeFilter} setTimeFilter={setTimeFilter}
              articleType={articleType} setArticleType={setArticleType}
              sortBy={sortBy} setSortBy={setSortBy} />
            <div className="content-area">
              {/* Playlist header */}
              <div style={detail.header}>
                <button className="back-btn" onClick={() => setSelectedList(null)} style={{ fontSize: 22, marginRight: 4 }}>←</button>
                <div style={detail.cover}>
                  {liveSelectedList.articles.length === 0
                    ? <span style={{ fontSize: 32 }}>📚</span>
                    : <BookIcon size={36} />
                  }
                </div>
                <div style={detail.meta}>
                  <span style={detail.label}>Reading List</span>
                  <h2 style={detail.title}>{liveSelectedList.name}</h2>
                  <span style={detail.count}>
                    {liveSelectedList.articles.length} article{liveSelectedList.articles.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div style={{ height: 1, background: "#e8ecf5", margin: "16px 0" }} />

              {liveSelectedList.articles.length === 0 ? (
                <p className="content-area__empty">
                  This reading list is empty.<br />
                  <span style={{ fontSize: 12, color: "#aaa" }}>Click "Add to List" on any article to add it here.</span>
                </p>
              ) : (
                liveSelectedList.articles.map((a) => (
                  <ArticleCard
                    key={a.id ?? a.title}
                    article={a}
                    isSaved={savedIds.has(a.id ?? a.title)}
                    onSaveToggle={onSaveToggle}
                    readingLists={readingLists}
                    onAddToList={handleAddToList}
                    onCreateAndAdd={handleCreateAndAdd}
                    onRemoveFromList={(art) => handleRemoveFromList(liveSelectedList.id, art)}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* ARCHIVE */}
        {activeTab === "Archive" && (
          <>
            <RefinePanel timeFilter={timeFilter} setTimeFilter={setTimeFilter}
              articleType={articleType} setArticleType={setArticleType}
              sortBy={sortBy} setSortBy={setSortBy} />
            <div className="content-area">
              <h2 className="content-area__title">Archive</h2>
              {savedArticles.length === 0
                ? <p className="content-area__empty">No archived articles yet. Save articles from the Articles page first.</p>
                : savedArticles.map((a) => (
                  <ArticleCard
                    key={a.id ?? a.title}
                    article={a}
                    isSaved={savedIds.has(a.id ?? a.title)}
                    onSaveToggle={onSaveToggle}
                    readingLists={readingLists}
                    onAddToList={handleAddToList}
                    onCreateAndAdd={handleCreateAndAdd}
                  />
                ))
              }
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ── inline style ──
const rlCard = {
  thumb: {
    width: 44, height: 44, borderRadius: 8,
    background: "#e8ecf5", flexShrink: 0,
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr", overflow: "hidden",
    placeItems: "center", gap: 1,
  },
  thumbCell: {
    width: "100%", height: "100%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#1a2e6e", background: "#dde3f0",
  },
  info: { flex: 1, display: "flex", flexDirection: "column", gap: 2 },
};

const detail = {
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 4 },
  cover: {
    width: 72, height: 72, borderRadius: 12,
    background: "#dde3f0", display: "flex",
    alignItems: "center", justifyContent: "center",
    color: "#1a2e6e", flexShrink: 0,
    boxShadow: "0 4px 16px rgba(26,46,110,0.15)",
  },
  meta: { display: "flex", flexDirection: "column", gap: 2 },
  label: { fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8899bb" },
  title: { fontSize: 22, fontWeight: 700, color: "#0d1f5c", margin: 0 },
  count: { fontSize: 13, color: "#8899bb" },
};