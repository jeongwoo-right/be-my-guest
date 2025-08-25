import React, { useState, useEffect } from 'react';
import { fetchUserReviews } from '../../../services/reviewService';
import type { Review } from '../../../services/reviewService';
import ReviewItem from './ReviewItem';
import './MyReviewTab.css';

const MyReviewTab: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      const userId = 1; // 사용자 ID를 1로 가정
      const data = await fetchUserReviews(userId);
      setReviews(data);
      setIsLoading(false);
    };

    loadReviews();
  }, []); // 한 번만 실행

  return (
    <div className="my-review-tab">
      <h2>내가 작성한 리뷰</h2>
      <div className="review-list">
        {isLoading ? (
          <p>리뷰를 불러오는 중입니다...</p>
        ) : reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewItem key={review.reviewId} review={review} />
          ))
        ) : (
          <p>작성한 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyReviewTab;