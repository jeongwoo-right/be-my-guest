import React from 'react';
import type { Review } from '../../../services/reviewService';
import './ReviewItem.css';
import { BACKEND_URL } from '../../../services/api';

interface ReviewItemProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: number) => void;
}

// 별점을 별 아이콘으로 표시하는 간단한 컴포넌트
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="star-rating">
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </div>
  );
};

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onEdit, onDelete }) => {
  // createdAt과 updatedAt을 비교하여 표시할 날짜와 라벨을 결정
  const isEdited = review.updatedAt !== review.createdAt;
  const displayDate = new Date(review.updatedAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="review-item">
      {/* 🌟 1. 리뷰의 모든 텍스트 콘텐츠를 감싸는 div 추가 */}
      <div className="review-content-wrapper">
        <div className="review-header">
          {/* 썸네일 이미지를 헤더 안으로 이동 */}
          <img 
            src={`${BACKEND_URL}/thumbnail/guesthouse/${review.guesthouseId}.jpg`} 
            alt={review.guesthouseName}
            className="review-thumbnail"
          />
          <div className="review-header-text">
            <a 
              href={`/guesthouses/${review.guesthouseId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="guesthouse-name-link"
            >
              <h3 className="guesthouse-name">{review.guesthouseName}</h3>
            </a>
            <div className="review-rating">
              <StarRating rating={review.rating} />
              <span className="rating-text">{review.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="date-wrapper">
            {isEdited && <span className="edited-label">(수정됨)</span>}
            <span className="review-date">{displayDate}</span>
          </div>
        </div>
        
        <p className="review-content">{review.content}</p>
        
        <div className="review-actions">
          <button className="edit-button" onClick={() => onEdit(review)}>수정</button>
          <button className="delete-button" onClick={() => onDelete(review.reviewId)}>삭제</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;