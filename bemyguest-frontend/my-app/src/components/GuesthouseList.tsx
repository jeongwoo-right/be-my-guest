import React from "react";
import type { Guesthouse } from "../services/guesthouseService";
import GuesthouseCard from "./GuesthouseCard";
import "./GuesthouseList.css"; // 목록 전용 CSS

interface GuesthouseListProps {
  guesthouses: Guesthouse[];
  isLoading: boolean;
}

const GuesthouseList: React.FC<GuesthouseListProps> = ({
  guesthouses,
  isLoading,
}) => {
  if (isLoading) {
    return <p>검색 결과를 불러오는 중입니다...</p>;
  }

  if (guesthouses.length === 0) {
    return <p>검색 결과가 없습니다.</p>;
  }

  return (
    <div className="guesthouse-grid">
      {guesthouses.map((guesthouse) => (
        <GuesthouseCard key={guesthouse.id} guesthouse={guesthouse} />
      ))}
    </div>
  );
};

export default GuesthouseList;
