import React, { useState, useEffect } from 'react';
import { fetchUserReviews, updateReview, deleteReview } from '../../../services/reviewService';
import type { Review } from '../../../services/reviewService';
import ReviewItem from './ReviewItem';
import './MyReviewTab.css';

const MyReviewTab: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    setIsLoading(true);
    const data = await fetchUserReviews();
    setReviews(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleReviewDelete = async (reviewId: number) => {
    if (window.confirm('리뷰를 정말로 삭제하시겠습니까?')) {
      try {
        await deleteReview(reviewId);
        alert('리뷰가 삭제되었습니다.');
        loadReviews(); // 목록 새로고침
      } catch (error) {
        alert('리뷰 삭제에 실패했습니다.');
      }
    }
  };

  const handleReviewEdit = (review: Review) => {
    const newContent = prompt('새로운 리뷰 내용을 입력하세요:', review.content);
    if (newContent !== null) {
      const newRating = parseInt(prompt('새로운 평점을 입력하세요 (1-5):', String(review.rating)) || '0', 10);
      if (newRating >= 1 && newRating <= 5) {
        updateReview(review.reviewId, { rating: newRating, content: newContent })
          .then(() => {
            alert('리뷰가 수정되었습니다.');
            loadReviews(); // 목록 새로고침
          })
          .catch(() => alert('리뷰 수정에 실패했습니다.'));
      } else {
        alert('유효한 평점(1-5)을 입력해주세요.');
      }
    }
  };

  return (
    <div className="my-page-tab-container">
      <h2 className="my-page-tab-title">내가 작성한 리뷰</h2>
      <div className="my-page-tab-content">
        <div className="review-list">
          {isLoading ? (
            <p>리뷰를 불러오는 중입니다...</p>
          ) : reviews.length > 0 ? (
            reviews.map(review => (
              <ReviewItem 
                key={review.reviewId} 
                review={review}
                onEdit={handleReviewEdit}
                onDelete={handleReviewDelete}
              />
            ))
          ) : (
            <p>작성한 리뷰가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReviewTab;