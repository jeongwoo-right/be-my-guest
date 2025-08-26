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

  // 🌟 2. 리뷰 삭제 핸들러 함수 추가
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

  // 🌟 3. 리뷰 수정 핸들러 함수 추가 (수정 로직은 Modal 등으로 구현 필요)
  const handleReviewEdit = (review: Review) => {
    // 이 함수는 실제 수정 UI(예: Modal 창)를 띄우는 역할을 합니다.
    // 여기서는 간단히 prompt를 사용한 예시를 보여드립니다.
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
    <div className="my-review-tab">
      <h2>내가 작성한 리뷰</h2>
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
  );
};

export default MyReviewTab;