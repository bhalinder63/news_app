import React, { useEffect, useRef } from "react";
import Newsitems from "./Newsitems";
import SkeletonCard from "./SkeletonCard";
import useFetchNews from "../hooks/useFetchNews";

const News = ({ category, setProgress, country, searchQuery }) => {
  const { articles, loading, error, hasMore, loadMore } = useFetchNews({
    category,
    country,
    searchQuery,
    setProgress,
  });

  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    document.title = `NewsMonkey - ${
      searchQuery
        ? `Search: ${searchQuery}`
        : category.charAt(0).toUpperCase() + category.slice(1)
    }`;
  }, [category, searchQuery]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, loadMore]);

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const heading = searchQuery ? `Results for "${searchQuery}"` : categoryLabel;
  const subheading = searchQuery
    ? "Showing the latest matching articles"
    : `Top ${categoryLabel} headlines from around the world`;

  return (
    <div className="container">
      <div className="nm-page-header">
        <h1 className="nm-heading">
          {searchQuery ? "🔍 " : ""}
          <span className="nm-heading-accent">{heading}</span>
        </h1>
        <p className="nm-subheading">{subheading}</p>
      </div>

      {error && <div className="nm-error">{error}</div>}

      <div className="nm-grid">
        {articles.map((article) => (
          <Newsitems
            key={article.url}
            title={article.title}
            description={article.description}
            imageUrl={article.urlToImage}
            newsUrl={article.url}
            author={article.author}
            date={article.publishedAt}
            source={article.source?.name}
          />
        ))}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
      </div>

      {!loading && !error && articles.length === 0 && (
        <div className="nm-empty-state">
          <div className="nm-empty-icon">📭</div>
          <h5 className="nm-empty-title">No articles found</h5>
          <p className="nm-empty-text">
            Try a different search term or category.
          </p>
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <div className="nm-end-marker">You've reached the end</div>
      )}

      <div ref={sentinelRef} className="sentinel" />
    </div>
  );
};

export default News;
