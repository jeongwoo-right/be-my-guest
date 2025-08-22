import React from 'react';
import './Pagination.css'; // Pagination 전용 CSS 파일

// Pagination 컴포넌트가 부모로부터 받을 props 타입 정의
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // 1부터 totalPages까지의 숫자 배열을 생성합니다.
  // 예: totalPages가 5이면 [1, 2, 3, 4, 5]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination-container">
      {/* '이전' 버튼 */}
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map(number => (
        <button
          key={number}
          className={`page-btn ${currentPage === number ? 'active' : ''}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      {/* '다음' 버튼 */}
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;