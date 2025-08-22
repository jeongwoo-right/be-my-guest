import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// API 서비스와 타입 import
import { searchGuesthouses } from '../services/guesthouseService';
import type { Guesthouse, GuesthouseSearchRequest } from '../services/guesthouseService';

// 자식 컴포넌트들 import
import SearchBar from '../components/SearchBar';
import GuesthouseList from '../components/GuesthouseList';
import Pagination from '../components/Pagination';

// 페이지 전용 CSS import
import './GuesthouseListPage.css';

const GuesthouseListPage: React.FC = () => {
  // --- 상태 관리 (State) ---
  const [guesthouses, setGuesthouses] = useState<Guesthouse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // URL의 쿼리 파라미터를 읽고 쓰기 위한 hook
  const [searchParams, setSearchParams] = useSearchParams();

  // --- 데이터 로딩 (Effect) ---
  // searchParams나 currentPage가 변경될 때마다 실행
  useEffect(() => {
    // URL에서 검색 조건들을 가져옴
    const region = searchParams.get('region');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const guests = searchParams.get('guests');

    // 필수 검색 조건이 URL에 있을 때만 API를 호출
    if (region && startDate && endDate && guests) {
      const loadGuesthouses = async () => {
        setIsLoading(true);

        const searchRequest: GuesthouseSearchRequest = {
          region,
          startDate,
          endDate,
          guests: Number(guests),
          page: currentPage - 1, // API는 0-indexed, UI는 1-indexed
          size: 10,
          sort: 'rating', // 기본 정렬값
          dir: 'desc',
        };

        const response = await searchGuesthouses(searchRequest);
        
        setGuesthouses(response.content);
        setTotalPages(response.totalPages);
        setIsLoading(false);
      };

      loadGuesthouses();
    } else {
      // 필수 검색 조건이 없으면 목록을 비움
      setGuesthouses([]);
    }
  }, [searchParams, currentPage]);

  // --- 이벤트 핸들러 ---

  // SearchBar 컴포넌트에서 '검색' 버튼을 눌렀을 때 실행될 함수
  const handleSearch = (criteria: { region: string; startDate: string; endDate: string; guests: number }) => {
    // 검색 조건으로 URL의 쿼리 파라미터를 업데이트
    // 이 업데이트가 발생하면 위의 useEffect가 자동으로 다시 실행됨
    setSearchParams({
      region: criteria.region,
      startDate: criteria.startDate,
      endDate: criteria.endDate,
      guests: String(criteria.guests),
    });
    // 새로운 검색이므로 1페이지로 리셋
    setCurrentPage(1);
  };

  // Pagination 컴포넌트에서 페이지 번호를 클릭했을 때 실행될 함수
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // 페이지 스크롤을 맨 위로 올리는 사용자 경험 개선 코드
      window.scrollTo(0, 0);
    }
  };

  // --- 렌더링 (Return JSX) ---
  return (
    <div className="guesthouse-list-container">
      {/* 검색 바 컴포넌트 */}
      <SearchBar onSearch={handleSearch} />

      {/* 게스트하우스 목록 컴포넌트 */}
      <GuesthouseList guesthouses={guesthouses} isLoading={isLoading} />

      {/* 페이지네이션 컴포넌트 (결과가 있을 때만 표시) */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default GuesthouseListPage;