import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const CATEGORIES = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

const COUNTRIES = [
  { code: "us", name: "US" },
  { code: "gb", name: "UK" },
  { code: "au", name: "Australia" },
  { code: "ca", name: "Canada" },
  { code: "in", name: "India" },
];

const Navbar = ({ darkMode, toggleDarkMode, country, setCountry, onSearch }) => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      navigate("/");
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    onSearch("");
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link${isActive ? " active fw-semibold" : ""}`;

  return (
    <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold" to="/" onClick={clearSearch}>
          NewsMonkey
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {CATEGORIES.map((cat) => (
              <li className="nav-item" key={cat}>
                <NavLink
                  className={navLinkClass}
                  to={`/${cat}`}
                  onClick={clearSearch}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </NavLink>
              </li>
            ))}
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/saved">
                ★ Saved
              </NavLink>
            </li>
          </ul>

          <form className="d-flex me-2" onSubmit={handleSearch}>
            <input
              className="form-control form-control-sm me-1"
              type="search"
              placeholder="Search news..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ minWidth: 160 }}
            />
            <button className="btn btn-outline-success btn-sm" type="submit">
              Search
            </button>
          </form>

          <select
            className="form-select form-select-sm me-2"
            style={{ width: "auto" }}
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              onSearch("");
            }}
            title="Select country"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={toggleDarkMode}
            title="Toggle dark mode"
          >
            {darkMode ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
