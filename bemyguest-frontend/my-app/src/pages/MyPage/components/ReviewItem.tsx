import React from 'react';
import type { Review } from '../../../services/reviewService';
import './ReviewItem.css';

interface ReviewItemProps {
  review: Review;
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

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('ko-KR');

  return (
    <div className="review-item">
      <div className="review-header">
        <h3 className="guesthouse-name">{review.guesthouseName}</h3>
        <span className="review-date">{formattedDate}</span>
      </div>
      <div className="review-rating">
        <StarRating rating={review.rating} />
        <span className="rating-text">{review.rating.toFixed(1)}</span>
      </div>
      <p className="review-content">{review.content}</p>
      <div className="review-actions">
        <button className="edit-button">수정</button>
        <button className="delete-button">삭제</button>
      </div>
    </div>
  );
};

export default ReviewItem;