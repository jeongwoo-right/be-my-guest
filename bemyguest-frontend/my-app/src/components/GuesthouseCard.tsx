import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Guesthouse } from "../services/guesthouseService";
import { FaStar } from "react-icons/fa";
import "./GuesthouseCard.css";
import { BACKEND_URL } from "../services/api";

interface GuesthouseCardProps {
  guesthouse: Guesthouse;
}

const GuesthouseCard: React.FC<GuesthouseCardProps> = ({ guesthouse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCardClick = () => {
    // carry user-chosen dates/guests only
    const src = new URLSearchParams(location.search);
    const dst = new URLSearchParams();
    for (const k of ["startDate", "endDate", "guests"]) {
      const v = src.get(k);
      if (v) dst.set(k, v);
    }
    navigate({
      pathname: `/guesthouses/${guesthouse.id}`,
      search: dst.toString() ? `?${dst.toString()}` : "",
    });
  };

  return (
    <div className="guesthouse-card" onClick={handleCardClick}>
      <div className="card-image-wrapper">
        <img
          src={`${BACKEND_URL}/thumbnail/guesthouse/${guesthouse.id}.jpg`}
          alt={guesthouse.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/no-image.png";
          }}
        />
      </div>
      <div className="card-info">
        <div className="card-title">
          <h3>{guesthouse.name}</h3>
          <div className="card-rating">
            <FaStar color="#ffb400" />
            <span>
              {guesthouse.ratingAvg.toFixed(1)} ({guesthouse.ratingCount})
            </span>
          </div>
        </div>
        <p className="card-description">{guesthouse.description}</p>
        <div className="card-bottom-info">
          <p className="card-address">최대 인원: {guesthouse.capacity}명</p>
          <p className="card-price">₩{guesthouse.price.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default GuesthouseCard;
