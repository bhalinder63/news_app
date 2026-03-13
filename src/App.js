import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import News from "./Components/News";
import SavedNews from "./Components/SavedNews";
import LoadingBar from "react-top-loading-bar";

const CATEGORIES = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

const App = () => {
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [country, setCountry] = useState(
    () => localStorage.getItem("country") || "us"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("country", country);
  }, [country]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const newsProps = { setProgress, country, searchQuery };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        country={country}
        setCountry={setCountry}
        onSearch={setSearchQuery}
      />
      <LoadingBar height={3} color="#f11946" progress={progress} />
      <Routes>
        <Route
          path="/"
          element={<News {...newsProps} key="home" category="general" />}
        />
        {CATEGORIES.map((cat) => (
          <Route
            key={cat}
            path={`/${cat}`}
            element={<News {...newsProps} key={cat} category={cat} />}
          />
        ))}
        <Route path="/saved" element={<SavedNews />} />
      </Routes>
    </Router>
  );
};

export default App;
