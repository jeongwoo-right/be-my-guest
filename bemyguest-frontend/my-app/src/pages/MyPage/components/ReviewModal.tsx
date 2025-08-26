import React, { useState } from 'react';
import './ReviewModal.css';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, content: string) => void;
  guesthouseName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, guesthouseName }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (content.trim() === '') {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }
    onSubmit(rating, content);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>리뷰 작성</h2>
        <h3>{guesthouseName}</h3>
        <div className="rating-input">
          <span>별점: </span>
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)} className={star <= rating ? 'active' : ''}>
              ★
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="숙소에서의 경험을 공유해주세요."
          rows={8}
        />
        <div className="modal-actions">
          <button onClick={onClose} className="close-button">닫기</button>
          <button onClick={handleSubmit} className="submit-button">제출</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;