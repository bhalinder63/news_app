import { useState, useEffect, useCallback } from "react";

const PAGE_SIZE = 5;
const PROXY_URL = process.env.REACT_APP_PROXY_URL;

const useFetchNews = ({ category, country, searchQuery, setProgress }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const doFetch = useCallback(
    async (pageNum, isReset) => {
      setProgress(10);
      setLoading(true);
      setError(null);

      const params = searchQuery
        ? new URLSearchParams({
            endpoint: "everything",
            q: searchQuery,
            page: pageNum,
            pageSize: PAGE_SIZE,
            language: "en",
            sortBy: "publishedAt",
          })
        : new URLSearchParams({
            endpoint: "top-headlines",
            country,
            category,
            page: pageNum,
            pageSize: PAGE_SIZE,
          });

      const url = `${PROXY_URL}/api/news?${params}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        setProgress(70);

        if (data.status === "error") {
          setError(data.message || "Something went wrong.");
        } else {
          const fetched = (data.articles || []).filter(
            (a) => a.title !== "[Removed]"
          );
          setArticles((prev) => (isReset ? fetched : [...prev, ...fetched]));
          setHasMore(fetched.length === PAGE_SIZE);
        }
      } catch {
        setError("Network error. Please check your connection.");
      }

      setLoading(false);
      setProgress(100);
    },
    [category, country, searchQuery, setProgress]
  );

  useEffect(() => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
    doFetch(1, true);
  }, [doFetch]);

  const loadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    doFetch(next, false);
  }, [page, doFetch]);

  return { articles, loading, error, hasMore, loadMore };
};

export default useFetchNews;
