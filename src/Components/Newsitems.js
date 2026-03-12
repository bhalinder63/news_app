import React, { useState, useEffect } from "react";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1593789198777-f29bc259780e?w=500&auto=format&fit=crop&q=60";

const Newsitems = ({
  title,
  description,
  imageUrl,
  newsUrl,
  author,
  date,
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
        {
          title,
          description,
          imageUrl: imageUrl || DEFAULT_IMAGE,
          newsUrl,
          author,
          date,
        },
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
  const formattedDate = new Date(date).toDateString();
  const authorName = author || "Unknown";

  return (
    <>
      <div className="my-3">
        <div className="card h-100">
          <img src={img} className="card-img-top" alt={title} />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{title}</h5>
            <p className="card-text flex-grow-1">{description}</p>
            <p className="card-text">
              <small className="text-muted">
                By {authorName} on {formattedDate}
              </small>
            </p>
            <div className="d-flex gap-2 flex-wrap mt-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowModal(true)}
              >
                Preview
              </button>
              <a
                href={newsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-dark"
              >
                Read more
              </a>
              <button
                className={`btn btn-sm ${
                  bookmarked ? "btn-warning" : "btn-outline-warning"
                }`}
                onClick={toggleBookmark}
                title={bookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {bookmarked ? "★" : "☆"}
              </button>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={handleShare}
                title="Share article"
              >
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content-custom card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn-close position-absolute top-0 end-0 m-2"
              onClick={() => setShowModal(false)}
            />
            <img src={img} alt={title} className="card-img-top" />
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <p className="card-text">{description}</p>
              <p className="card-text">
                <small className="text-muted">
                  By {authorName} on {formattedDate}
                </small>
              </p>
              <a
                href={newsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark btn-sm"
              >
                Read Full Article
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Newsitems;
