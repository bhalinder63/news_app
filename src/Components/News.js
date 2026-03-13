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

  const heading = searchQuery
    ? `Search results for "${searchQuery}"`
    : `Top ${category.charAt(0).toUpperCase() + category.slice(1)} Headlines`;

  return (
    <div className="container my-3">
      <h3
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        {heading}
      </h3>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        {articles.map((article) => (
          <div className="col-md-4" key={article.url}>
            <Newsitems
              title={article.title}
              description={article.description}
              imageUrl={article.urlToImage}
              newsUrl={article.url}
              author={article.author}
              date={article.publishedAt}
            />
          </div>
        ))}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div className="col-md-4" key={`skeleton-${i}`}>
              <SkeletonCard />
            </div>
          ))}
      </div>

      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-5">
          <h5 className="text-muted">No articles found.</h5>
          <p className="text-muted">
            Try a different search term or category.
          </p>
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <p className="text-center text-muted my-4">
          You've reached the end.
        </p>
      )}

      <div ref={sentinelRef} className="sentinel" />
    </div>
  );
};

export default News;
