import React, { useState, useEffect } from "react";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1593789198777-f29bc259780e?w=600&auto=format&fit=crop&q=60";

const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  const intervals = [
    { label: "y", secs: 31536000 },
    { label: "mo", secs: 2592000 },
    { label: "d", secs: 86400 },
    { label: "h", secs: 3600 },
    { label: "m", secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return "Just now";
};

const Newsitems = ({
  title,
  description,
  imageUrl,
  newsUrl,
  author,
  date,
  source,
  onBookmarkChange,
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setBookmarked(bookmarks.some((b) => b.newsUrl === newsUrl));
  }, [newsUrl]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    let updated;
    if (bookmarked) {
      updated = bookmarks.filter((b) => b.newsUrl !== newsUrl);
    } else {
      updated = [
        ...bookmarks,
        { title, description, imageUrl: imageUrl || DEFAULT_IMAGE, newsUrl, author, date, source },
      ];
    }
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    setBookmarked(!bookmarked);
    if (onBookmarkChange) onBookmarkChange();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: newsUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(newsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const img = imageUrl || DEFAULT_IMAGE;
  const authorName = author || "Unknown";
  const sourceName = source || new URL(newsUrl).hostname.replace("www.", "");

  return (
    <>
      <article className="nm-card">
        <div className="nm-card-img-wrap">
          <img src={img} className="nm-card-img" alt="" loading="lazy" />
          <span className="nm-card-source">{sourceName}</span>
        </div>
        <div className="nm-card-body">
          <h3 className="nm-card-title">{title}</h3>
          <p className="nm-card-desc">{description}</p>
          <div className="nm-card-meta">
            <span>{authorName}</span>
            <span className="nm-card-meta-dot" />
            <span>{timeAgo(date)}</span>
          </div>
          <div className="nm-card-actions">
            <button className="nm-btn nm-btn-ghost" onClick={() => setShowModal(true)}>
              Preview
            </button>
            <a
              href={newsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nm-btn nm-btn-primary"
            >
              Read more →
            </a>
            <span className="nm-btn-spacer" />
            <button
              className={`nm-btn-icon${bookmarked ? " bookmarked" : ""}`}
              onClick={toggleBookmark}
              title={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              {bookmarked ? "★" : "☆"}
            </button>
            <button
              className="nm-btn-icon"
              onClick={handleShare}
              title="Share article"
            >
              {copied ? "✓" : "↗"}
            </button>
          </div>
        </div>
      </article>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <button className="nm-modal-close" onClick={() => setShowModal(false)}>
              ✕
            </button>
            <div className="nm-card-img-wrap">
              <img src={img} alt="" className="nm-card-img" />
              <span className="nm-card-source">{sourceName}</span>
            </div>
            <div className="nm-modal-body">
              <h4 className="nm-modal-title">{title}</h4>
              <p className="nm-modal-desc">{description}</p>
              <p className="nm-modal-meta">
                By {authorName} · {new Date(date).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </p>
              <a
                href={newsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nm-btn nm-btn-primary"
              >
                Read Full Article →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Newsitems;
