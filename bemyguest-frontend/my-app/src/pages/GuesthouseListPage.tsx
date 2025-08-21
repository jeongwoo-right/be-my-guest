import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// 1. 서비스 파일 이름과 함수 이름, 타입을 정확하게 import 합니다.
import { searchGuesthouses } from '../services/guesthouseService';
import type { Guesthouse } from '../services/guesthouseService';
import './GuesthouseListPage.css';

const GuesthouseListPage: React.FC = () => {
  // 상태 변수들
  const [guesthouses, setGuesthouses] = useState<Guesthouse[]>([]); // 게스트하우스 목록
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(0); // 🌟 전체 페이지 수 상태 추가
  const [isLoading, setIsLoading] = useState(true); // 로딩 중인지 여부

  // URL에서 검색어(keyword) 가져오기
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  // 페이지가 열리거나, 검색어/페이지 번호가 바뀔 때마다 실행될 로직
  useEffect(() => {
    // 검색어가 없으면 API를 호출하지 않음
    if (!keyword) {
      setIsLoading(false);
      setGuesthouses([]);
      return;
    }
  
    const loadGuesthouses = async () => {
      setIsLoading(true); // 로딩 시작
      // 2. API 응답에서 content와 totalPages를 구조 분해 할당으로 받습니다.
      const response = await searchGuesthouses(keyword, currentPage);
      setGuesthouses(response.content); // 실제 게스트하우스 목록은 content에 있습니다.
      setTotalPages(response.totalPages); // 전체 페이지 수 상태를 업데이트합니다.
      setIsLoading(false); // 로딩 끝
    };

    loadGuesthouses();
  }, [keyword, currentPage]); // keyword나 currentPage가 바뀔 때마다 이 함수를 다시 실행

  // 페이지 변경 핸들러 함수
  const handlePageChange = (newPage: number) => {
    // 페이지 번호가 1과 totalPages 사이일 때만 상태 변경
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="guesthouse-list-container">
      <h1>'{keyword}' 검색 결과</h1>
      <div className="results-area">
        {isLoading ? (
          <p>검색 결과를 불러오는 중입니다...</p>
        ) : guesthouses.length > 0 ? (
          guesthouses.map(guesthouse => (
            <div key={guesthouse.id} className="guesthouse-item">
              <img src={guesthouse.thumbnailUrl} alt={guesthouse.name} />
              <h3>{guesthouse.name}</h3>
              <p>{guesthouse.location}</p>
              <span>1박 {guesthouse.price.toLocaleString()}원</span>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>

      {/* 3. 페이지네이션 UI 개선 */}
      <div className="pagination-area">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1} // 첫 페이지일 때 '이전' 버튼 비활성화
        >
          이전
        </button>
        <span> {currentPage} / {totalPages} </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages} // 마지막 페이지일 때 '다음' 버튼 비활성화
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default GuesthouseListPage;