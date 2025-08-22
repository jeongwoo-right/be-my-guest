import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Guesthouse } from '../services/guesthouseService';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa'; // 하트와 별 아이콘
import './GuesthouseCard.css'; // 카드 전용 CSS
import { BACKEND_URL } from '../services/api';

interface GuesthouseCardProps {
  guesthouse: Guesthouse;
}

const GuesthouseCard: React.FC<GuesthouseCardProps> = ({ guesthouse }) => {
  const [isWished, setIsWished] = useState(false);
  // 2. useNavigate 훅을 초기화합니다.
  const navigate = useNavigate();

  const toggleWish = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 시 페이지 이동이 되는 것을 방지
    setIsWished(!isWished);
  };

  // 3. 카드 전체를 클릭했을 때 실행될 핸들러 함수를 만듭니다.
  const handleCardClick = () => {
    // guesthouse.id를 사용하여 상세 페이지 URL로 이동시킵니다.
    navigate(`/guesthouses/${guesthouse.id}`);
  };

  return (
    // 4. div에 onClick 이벤트를 추가합니다.
    <div className="guesthouse-card" onClick={handleCardClick}>
      <div className="card-image-wrapper">
        <img 
          src={`${BACKEND_URL}/thumbnail/guesthouse/${guesthouse.id}.jpg`} 
          alt={guesthouse.name} 
        />
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