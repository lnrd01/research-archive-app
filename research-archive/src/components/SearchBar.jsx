import React from "react";
import '../styles/searchbar.css';
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <div className="searchbar-wrapper">
      <div className="searchbar-input-container">   
        <span className="searchbar-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L15.5 15.5M17 10.5C17 14.0899 14.0899 17 10.5 17C6.91015 17 4 14.0899 4 10.5C4 6.91015 6.91015 4 10.5 4C14.0899 4 17 6.91015 17 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="searchbar-input"
        />
      </div>
    </div>
  );
}
