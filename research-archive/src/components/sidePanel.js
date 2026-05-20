import { useState } from "react";

// SidePanel receives these from App.js:
// onTimeChange   → tells App which year filter was picked
// onTypeChange   → tells App which article type was picked
// onSortChange   → tells App which sort was picked
function SidePanel({ onTimeChange, onTypeChange, onSortChange }) {

  const [selectedTime, setSelectedTime] = useState("Any time");
  const [selectedType, setSelectedType] = useState("Any type");
  const [selectedSort, setSelectedSort] = useState("Sort by relevance");

  // Custom range inputs
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear]     = useState("");
  const [showCustom, setShowCustom] = useState(false);

  // --- Time filter click handler ---
  function handleTimeClick(option) {
    setSelectedTime(option);

    // Show custom range inputs when "Custom range..." is picked
    if (option === "Custom range...") {
      setShowCustom(true);
      // Don't call onTimeChange yet — wait for user to apply
    } else {
      setShowCustom(false);
      // Tell App.js the selected time
      if (onTimeChange) onTimeChange(option);
    }
  }

  // --- Apply custom range ---
  function handleApplyCustomRange() {
    if (!fromYear && !toYear) return;
    // Send custom range up to App.js as an object
    if (onTimeChange) onTimeChange({ from: fromYear, to: toYear });
  }

  // --- Article type click handler ---
  function handleTypeClick(option) {
    setSelectedType(option);
    if (onTypeChange) onTypeChange(option);
  }

  // --- Sort click handler ---
  function handleSortClick(option) {
    setSelectedSort(option);
    if (onSortChange) onSortChange(option);
  }

  // --- Time filter options ---
  const timeOptions = [
    "Any time",
    "Since 2026",
    "Since 2024",
    "Since 2022",
    "Custom range...",
  ];

  // --- Article type options ---
  const typeOptions = [
    "Any type",
    "Review Articles",
    "Research Articles",
    "Conference Papers",
    "Thesis",
  ];

  // --- Sort options ---
  const sortOptions = [
    "Sort by relevance",
    "Sort by date",
  ];

  // --- Reusable radio row ---
  function RadioOption({ label, selected, onClick }) {
    return (
      <div style={styles.radioRow} onClick={() => onClick(label)}>

        {/* Custom radio circle */}
        <div style={{
          ...styles.radioCircle,
          border: selected ? "1.5px solid #1a2e5a" : "1.5px solid #aaaaaa",
          backgroundColor: selected ? "#1a2e5a" : "#ffffff",
        }}>
          {selected && <div style={styles.radioInnerDot} />}
        </div>

        {/* Label */}
        <span style={selected ? styles.radioLabelActive : styles.radioLabel}>
          {label}
        </span>

      </div>
    );
  }

  return (
    <div style={styles.panel}>

      {/* ---- SECTION 1: Refine Results (Year filter) ---- */}
      <p style={styles.sectionTitle}>Refine Results</p>

      {timeOptions.map((option) => (
        <RadioOption
          key={option}
          label={option}
          selected={selectedTime === option}
          onClick={handleTimeClick}
        />
      ))}

      {/* Custom range inputs — only show when "Custom range..." is selected */}
      {showCustom && (
        <div style={styles.customRangeBox}>

          <div style={styles.customRangeRow}>
            <div style={styles.customInputGroup}>
              <label style={styles.customLabel}>From</label>
              <input
                style={styles.customInput}
                type="number"
                placeholder="2000"
                value={fromYear}
                onChange={(e) => setFromYear(e.target.value)}
                min="1900"
                max="2099"
              />
            </div>

            <div style={styles.customInputGroup}>
              <label style={styles.customLabel}>To</label>
              <input
                style={styles.customInput}
                type="number"
                placeholder="2024"
                value={toYear}
                onChange={(e) => setToYear(e.target.value)}
                min="1900"
                max="2099"
              />
            </div>
          </div>

          {/* Apply button */}
          <button style={styles.applyBtn} onClick={handleApplyCustomRange}>
            Apply Range
          </button>

        </div>
      )}

      <hr style={styles.divider} />

      {/* ---- SECTION 2: Article type ---- */}
      <p style={styles.sectionTitle}>Article type</p>

      {typeOptions.map((option) => (
        <RadioOption
          key={option}
          label={option}
          selected={selectedType === option}
          onClick={handleTypeClick}
        />
      ))}

      <hr style={styles.divider} />

      {/* ---- SECTION 3: Sort by ---- */}
      <p style={styles.sectionTitle}>Sort by</p>

      {sortOptions.map((option) => (
        <RadioOption
          key={option}
          label={option}
          selected={selectedSort === option}
          onClick={handleSortClick}
        />
      ))}

    </div>
  );
}

/* ---- STYLES ---- */
const styles = {

  panel: {
    width: "220px",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e0e0e0",
    padding: "24px 20px",
    fontFamily: "'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },

  sectionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "14px",
    marginTop: "0",
  },

  divider: {
    border: "none",
    borderTop: "1px solid #e0e0e0",
    margin: "20px 0",
  },

  radioRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
    cursor: "pointer",
  },

  radioCircle: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
  },

  radioInnerDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
  },

  radioLabel: {
    fontSize: "13.5px",
    color: "#555555",
    cursor: "pointer",
  },

  radioLabelActive: {
    fontSize: "13.5px",
    color: "#2563be",
    fontWeight: "500",
    cursor: "pointer",
  },

  // Custom range box
  customRangeBox: {
    marginTop: "10px",
    marginLeft: "4px",
    padding: "12px",
    backgroundColor: "#f0f4ff",
    borderRadius: "8px",
    border: "1px solid #c5cfe0",
  },

  customRangeRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },

  customInputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },

  customLabel: {
    fontSize: "11px",
    color: "#666",
    fontWeight: "600",
  },

  customInput: {
    width: "100%",
    padding: "6px 8px",
    border: "1px solid #c5cfe0",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },

  applyBtn: {
    width: "100%",
    padding: "7px",
    backgroundColor: "#1a2e5a",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "600",
  },

};

export default SidePanel;