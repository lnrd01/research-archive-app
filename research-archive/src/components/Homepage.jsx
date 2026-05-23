import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Homepage.css";

export default function HomePage({ onSearch, user, onOpenProfile }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch?.(query);
    navigate("/articles");
  };

  return (
    <div className="home-page">

      {/* TOP NAV */}
      <nav className="home-nav">
        <div className="home-nav-left">
          <button className="home-nav-btn" onClick={onOpenProfile}>
            <span className="home-nav-icon">👤</span>
            {user?.username === 'Guest' ? 'My Profile' : 'My Account'}
          </button>
          <button className="home-nav-btn" onClick={() => navigate("/library")}>
            <span className="home-nav-icon">☆</span> My Library
          </button>
        </div>
        <div className="home-nav-logo">
          <img src="/logo.png" alt="Acadexia logo mark" className="home-logo-mark" onError={(e) => { e.target.style.display = 'none'; }} />
          <button className="home-logo-button" onClick={onOpenProfile}>
            {user?.username === 'Guest' ? 'Log In' : `Welcome, ${user.username}`}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <main className="home-hero">
        <h1 className="home-title">ACADEXIA</h1>

        <form className="home-search-form" onSubmit={handleSubmit}>
          <span className="home-search-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15.5 15.5M17 10.5C17 14.09 14.09 17 10.5 17C6.91 17 4 14.09 4 10.5C4 6.91 6.91 4 10.5 4C14.09 4 17 6.91 17 10.5Z"
                stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <input
            className="home-search-input"
            type="text"
            placeholder="Search my library..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <p className="home-tagline">
          Elevating the pursuit of truth into the<br />practice of wisdom.
        </p>
      </main>

    </div>
  );
}