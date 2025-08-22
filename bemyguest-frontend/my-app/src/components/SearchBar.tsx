import React, { useState } from 'react';
import './SearchBar.css'; // SearchBar 전용 CSS

// 부모 컴포넌트(GuesthouseListPage)로 검색 이벤트를 전달하기 위한 props 타입
interface SearchBarProps {
  onSearch: (criteria: { region: string; startDate: string; endDate: string; guests: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [region, setRegion] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState('');

  const handleSearch = () => {
    // 입력값 검증 로직 추가 가능
    onSearch({ region, startDate, endDate, guests });
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        value={region} 
        onChange={(e) => setRegion(e.target.value)} 
        placeholder="지역" 
      />
      <input 
        type="date" 
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input 
        type="date" 
        value={endDate} 
        onChange={(e) => setEndDate(e.target.value)}
      />
      <input 
        type="text" 
        value={guests} 
        onChange={(e) => setGuests(e.target.value)}
        placeholder="인원"
      />
      {/* 정렬 기준 등 추가 가능 */}
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchBar;