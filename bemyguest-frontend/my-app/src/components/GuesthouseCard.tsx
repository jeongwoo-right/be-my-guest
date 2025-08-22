import React, { useState } from 'react';
import type { Guesthouse } from '../services/guesthouseService';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa'; // 하트와 별 아이콘
import './GuesthouseCard.css'; // 카드 전용 CSS

interface GuesthouseCardProps {
  guesthouse: Guesthouse;
}

const GuesthouseCard: React.FC<GuesthouseCardProps> = ({ guesthouse }) => {
  const [isWished, setIsWished] = useState(false);

  const toggleWish = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 전체 클릭 이벤트 방지
    setIsWished(!isWished);
    // TODO: 실제 찜하기 API 호출 로직 추가
  };

  return (
    <div className="guesthouse-card">
      <div className="card-image-wrapper">
        <img src={`https://via.placeholder.com/300x200?text=${guesthouse.name}`} alt={guesthouse.name} />
        <button className="wish-button" onClick={toggleWish}>
          {isWished ? <FaHeart color="red" /> : <FaRegHeart />}
        </button>
      </div>
      <div className="card-info">
        <div className="card-title">
          <h3>{guesthouse.name}</h3>
          <div className="card-rating">
            <FaStar color="#ffb400" />
            <span>{guesthouse.ratingAvg.toFixed(1)} ({guesthouse.ratingCount})</span>
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