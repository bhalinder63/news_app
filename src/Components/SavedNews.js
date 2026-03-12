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
      <div className="container text-center" style={{ marginTop: "120px" }}>
        <h3>No saved articles yet</h3>
        <p className="text-muted">Bookmark articles to read them later.</p>
      </div>
    );
  }

  return (
    <div className="container my-3" style={{ marginTop: "90px" }}>
      <h3
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "60px" }}
      >
        Saved Articles
      </h3>
      <div className="row">
        {bookmarks.map((article) => (
          <div className="col-md-4" key={article.newsUrl}>
            <Newsitems
              title={article.title}
              description={article.description}
              imageUrl={article.imageUrl}
              newsUrl={article.newsUrl}
              author={article.author}
              date={article.date}
              onBookmarkChange={refreshBookmarks}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedNews;
