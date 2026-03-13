import React from "react";

const SkeletonCard = () => (
  <div className="nm-card">
    <div className="skeleton nm-skeleton-img" />
    <div className="nm-skeleton-body">
      <span className="skeleton nm-skeleton-line nm-skeleton-line-title" />
      <span className="skeleton nm-skeleton-line" style={{ width: "100%" }} />
      <span className="skeleton nm-skeleton-line" style={{ width: "75%" }} />
      <span className="skeleton nm-skeleton-line nm-skeleton-line-sm" />
      <span className="skeleton nm-skeleton-btn" />
    </div>
  </div>
);

export default SkeletonCard;
