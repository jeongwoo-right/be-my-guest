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

  // 🌟 1. 정렬 기준과 방향을 위한 상태 추가
  const [sort, setSort] = useState<'rating' | 'price' | 'name'>('rating');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');

  const [searchParams, setSearchParams] = useSearchParams();

  // --- 데이터 로딩 (Effect) ---
  // 🌟 2. useEffect의 의존성 배열에 sort와 dir 추가
  useEffect(() => {
    // ... (URL에서 파라미터 가져오는 로직은 그대로) ...
    const region = searchParams.get('region');
    // ...
    
    if (region) { // 검색 조건이 있을 때만 실행
      const loadGuesthouses = async () => {
        setIsLoading(true);

        // 🌟 3. API 요청 객체에 sort와 dir 상태값 포함
        const searchRequest: GuesthouseSearchRequest = {
          region: region,
          startDate: searchParams.get('startDate') || '',
          endDate: searchParams.get('endDate') || '',
          guests: Number(searchParams.get('guests')) || 1,
          page: currentPage - 1,
          size: 10,
          sort: sort, // 상태값 사용
          dir: dir,   // 상태값 사용
        };

        const response = await searchGuesthouses(searchRequest);
        setGuesthouses(response.content);
        setTotalPages(response.totalPages);
        setIsLoading(false);
      };

      loadGuesthouses();
    }
  }, [searchParams, currentPage, sort, dir]); // 의존성 배열에 추가

  // --- 이벤트 핸들러 ---

  // SearchBar 컴포넌트에서 '검색' 버튼을 눌렀을 때 실행될 함수
  const handleSearch = (criteria: { region: string; startDate: string; endDate: string; guests: string }) => {
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

      {/* 🌟 4. 정렬 컨트롤 UI 추가 */}
      <div className="sort-controls">
        <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="rating">평점순</option>
          <option value="price">가격순</option>
          <option value="name">이름순</option>
        </select>
        <select value={dir} onChange={(e) => setDir(e.target.value as any)}>
          <option value="desc">내림차순</option>
          <option value="asc">오름차순</option>
        </select>
      </div>

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