import React, { useState, useEffect, useCallback } from "react";
import Newsitems from "./Newsitems";

const SavedNews = () => {
  const [bookmarks, setBookmarks] = useState([]);

  const refreshBookmarks = useCallback(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarks(saved);
  }, []);

  useEffect(() => {
    document.title = "NewsMonkey - Saved Articles";
    refreshBookmarks();
  }, [refreshBookmarks]);

  if (bookmarks.length === 0) {
    return (
      <div className="container">
        <div className="nm-page-header">
          <h1 className="nm-heading">
            <span className="nm-heading-accent">Saved Articles</span>
          </h1>
        </div>
        <div className="nm-empty-state">
          <div className="nm-empty-icon">🔖</div>
          <h5 className="nm-empty-title">No saved articles yet</h5>
          <p className="nm-empty-text">
            Bookmark articles to read them later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="nm-page-header">
        <h1 className="nm-heading">
          <span className="nm-heading-accent">Saved Articles</span>
        </h1>
        <p className="nm-subheading">
          {bookmarks.length} article{bookmarks.length !== 1 ? "s" : ""} saved
        </p>
      </div>
      <div className="nm-grid">
        {bookmarks.map((article) => (
          <Newsitems
            key={article.newsUrl}
            title={article.title}
            description={article.description}
            imageUrl={article.imageUrl}
            newsUrl={article.newsUrl}
            author={article.author}
            date={article.date}
            source={article.source}
            onBookmarkChange={refreshBookmarks}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedNews;
