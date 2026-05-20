import { useState } from "react";

const BookIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="16" height="22" rx="2" stroke="#4a5a7a" strokeWidth="1.4" fill="rgba(74,90,122,0.15)" />
    <rect x="4.5" y="2" width="2" height="22" fill="#4a5a7a" fillOpacity="0.35" />
    <line x1="8" y1="8"  x2="15" y2="8"  stroke="#4a5a7a" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="8" y1="12" x2="15" y2="12" stroke="#4a5a7a" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="8" y1="16" x2="12" y2="16" stroke="#4a5a7a" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill={filled ? "#3d5275" : "none"} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 1L7.9 4.6H11.8L8.7 6.9L9.9 10.5L6.5 8.2L3.1 10.5L4.3 6.9L1.2 4.6H5.1L6.5 1Z"
      stroke="#3d5275"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
  </svg>
);

const QuoteIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 7.5C1 5.5 2.5 4 4 3.5L4.5 4.5C3.3 5 2.5 5.8 2.5 7H4V9H1V7.5Z" fill="#3d5275" />
    <path d="M6.5 7.5C6.5 5.5 8 4 9.5 3.5L10 4.5C8.8 5 8 5.8 8 7H9.5V9H6.5V7.5Z" fill="#3d5275" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6H10M10 6L6.5 2.5M10 6L6.5 9.5" stroke="#3d5275" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const articles = [
  {
    id: 1,
    title: "Advances in Transformer-Based Neural Architectures for Scientific Literature Mining",
    snippet:
      "This paper explores state-of-the-art transformer models applied to automated extraction and classification of scholarly citations, proposing a novel pipeline that improves precision by 14% over existing baselines.",
    year: 2026,
    authors: "Chen, L., Patel, R., Moreau, F.",
  },
  {
    id: 2,
    title: "Cross-Modal Retrieval in Academic Databases: A Systematic Review",
    snippet:
      "A comprehensive systematic review of 87 studies examining cross-modal information retrieval systems in academic repositories, with particular focus on vision-language integration and user interaction paradigms.",
    year: 2025,
    authors: "Nakamura, H., Silva, A.",
  },
  {
    id: 3,
    title: "Semantic Search Versus Keyword Matching: Longitudinal Study on Research Efficiency",
    snippet:
      "Through a longitudinal study spanning 18 months with 340 graduate participants, we compare semantic vector search against traditional keyword matching across five academic disciplines.",
    year: 2025,
    authors: "Okonkwo, I., Lefevre, D., Zhang, W.",
  },
  {
    id: 4,
    title: "Federated Learning Approaches to Privacy-Preserving Citation Graph Analysis",
    snippet:
      "Proposes a federated framework for training citation recommendation models across institutions without sharing raw document data, achieving competitive performance with centralized approaches.",
    year: 2024,
    authors: "Vasquez, T., Kim, S., Brennan, C.",
  },
];

function LibraryCard({ article }) {
  const [saved, setSaved] = useState(false);

  return (
    <div style={styles.card}>
      <div style={styles.cardInner}>
        {/* Icon box */}
        <div style={styles.iconWrapper}>
          <BookIcon />
        </div>

        {/* Text content */}
        <div style={styles.content}>
          <p style={styles.title}>{article.title}</p>
          <p style={styles.snippet}>{article.snippet}</p>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <button
            style={{ ...styles.actionBtn, ...(saved ? styles.actionBtnSaved : {}) }}
            onClick={() => setSaved((s) => !s)}
          >
            <StarIcon filled={saved} />
            <span>Save</span>
          </button>
          <button style={styles.actionBtn}>
            <QuoteIcon />
            <span>Cite</span>
          </button>
        </div>
        <button style={styles.viewBtn}>
          View Details&nbsp;<ArrowIcon />
        </button>
      </div>
    </div>
  );
}

export default function LibraryCardList() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Articles</h2>
        <div style={styles.list}>
          {articles.map((article) => (
            <LibraryCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  /* ── Page ── */
  page: {
    minHeight: "100vh",
    /* Deep dark navy — matches the screenshot background */
    background: "#D2DBEB",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "36px 24px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "660px",
  },

  /* "Articles" label — light text on dark bg */
  heading: {
    color: "#2c3d56",
    fontSize: "20px",
    fontWeight: "500",
    letterSpacing: "0.03em",
    margin: "0 0 16px 2px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  /* ── Card ──
     The cards in the design are a flat mid-tone steel-blue/grey
     — roughly #8C97B0 with a subtle lighter top-left edge.        */
  card: {
    background: "linear-gradient(145deg, #9aa4b8 0%, #8891a8 100%)",
    borderRadius: "10px",
    padding: "14px 16px 10px 16px",
    boxShadow: "0 3px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
  },

  cardInner: {
    display: "flex",
    gap: "13px",
    alignItems: "flex-start",
    marginBottom: "10px",
  },

  /* Icon square — slightly darker than the card */
  iconWrapper: {
    flexShrink: 0,
    width: "42px",
    height: "42px",
    borderRadius: "7px",
    background: "linear-gradient(145deg, #7b8599 0%, #6e7a90 100%)",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2px",
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  /* Title — solid dark on the grey-blue card (like the black bars in mockup) */
  title: {
    color: "#0f1724",
    fontSize: "13.5px",
    fontWeight: "700",
    lineHeight: "1.45",
    margin: "0 0 6px 0",
  },

  /* Snippet — slightly lighter dark */
  snippet: {
    color: "#1e2d42",
    fontSize: "12px",
    lineHeight: "1.6",
    margin: 0,
  },

  /* ── Footer ── */
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid rgba(255,255,255,0.15)",
    paddingTop: "9px",
  },

  footerLeft: {
    display: "flex",
    gap: "6px",
  },

  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "none",
    border: "none",
    color: "#2c3d56",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "inherit",
    transition: "opacity 0.15s",
  },

  actionBtnSaved: {
    color: "#1a2a3e",
    fontWeight: "700",
  },

  viewBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "none",
    border: "none",
    color: "#2c3d56",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "inherit",
    transition: "opacity 0.15s",
  },
};
