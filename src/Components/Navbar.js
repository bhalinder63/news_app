import React, { useState, useCallback, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const CATEGORIES = [
  { key: "general", label: "General" },
  { key: "business", label: "Business" },
  { key: "entertainment", label: "Entertainment" },
  { key: "health", label: "Health" },
  { key: "science", label: "Science" },
  { key: "sports", label: "Sports" },
  { key: "technology", label: "Technology" },
];

const COUNTRIES = [
  { code: "us", name: "US", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "gb", name: "UK", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "au", name: "Australia", flag: "\u{1F1E6}\u{1F1FA}" },
  { code: "ca", name: "Canada", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "in", name: "India", flag: "\u{1F1EE}\u{1F1F3}" },
];

const Navbar = ({ darkMode, toggleDarkMode, country, setCountry, onSearch }) => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const collapseRef = useRef(null);

  const closeMenu = useCallback(() => {
    const el = collapseRef.current;
    if (el && el.classList.contains("show")) {
      const bsCollapse = window.bootstrap?.Collapse.getInstance(el);
      if (bsCollapse) bsCollapse.hide();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      navigate("/");
      closeMenu();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    onSearch("");
  };

  const handleNavClick = () => {
    clearSearch();
    closeMenu();
  };

  return (
    <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary nm-navbar">
      <div className="container">
        <NavLink className="nm-brand" to="/" onClick={clearSearch}>
          <span className="nm-brand-icon">📰</span>
          NewsMonkey
        </NavLink>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent" ref={collapseRef}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            {CATEGORIES.map((cat) => (
              <li className="nav-item" key={cat.key}>
                <NavLink
                  className={({ isActive }) =>
                    `nm-nav-link nav-link${isActive ? " active" : ""}`
                  }
                  to={`/${cat.key}`}
                  onClick={handleNavClick}
                >
                  {cat.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nm-nav-link nav-link${isActive ? " active" : ""}`
                }
                to="/saved"
                onClick={closeMenu}
              >
                ★ Saved
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            <form className="d-flex gap-1" onSubmit={handleSearch}>
              <input
                className="form-control nm-search-input"
                type="search"
                placeholder="Search news..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="nm-search-btn" type="submit">
                Search
              </button>
            </form>

            <select
              className="form-select nm-country-select"
              style={{ width: "auto" }}
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                onSearch("");
                closeMenu();
              }}
              title="Select country"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>

            <button
              className="nm-theme-toggle"
              onClick={toggleDarkMode}
              title="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
