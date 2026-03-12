import React from "react";

const SkeletonCard = () => (
  <div className="my-3">
    <div className="card">
      <span className="skeleton card-img-top" />
      <div className="card-body">
        <span
          className="skeleton d-block mb-2"
          style={{ height: 20, width: "80%" }}
        />
        <span
          className="skeleton d-block mb-1"
          style={{ height: 14, width: "100%" }}
        />
        <span
          className="skeleton d-block mb-3"
          style={{ height: 14, width: "60%" }}
        />
        <span
          className="skeleton d-block mb-3"
          style={{ height: 12, width: "50%" }}
        />
        <span className="skeleton d-block" style={{ height: 32, width: "30%" }} />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
