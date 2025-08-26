import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import mainImg from "../assets/main_flight.jpg";

export default function SearchPage() {
  const navigate = useNavigate();

  const handleSearch = (criteria: {
    region: string;
    startDate: string;
    endDate: string;
    guests: string;
  }) => {
    const params = new URLSearchParams({
      region: criteria.region,
      startDate: criteria.startDate,
      endDate: criteria.endDate,
      guests: String(criteria.guests),
    });
    navigate(`/guesthouses/search?${params.toString()}`);
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-white to-slate-50">
      {/* --- Hero --- */}
      <section className="relative">
        {/* 이미지 */}
        <img
          src={mainImg}
          alt="핑크빛 구름 위 비행기 날개"
          className="h-[280px] w-full object-cover sm:h-[340px] md:h-[420px]"
        />
        {/* 어두운 오버레이: 시각만, 클릭은 통과 */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/30 via-black/20 to-black/30" />

        {/* 중앙 카피 */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
          <h2 className="px-4 text-2xl font-bold tracking-tight text-white drop-shadow sm:text-3xl md:text-4xl">
            어디로 가시나요?
          </h2>
          <p className="mt-2 px-4 text-sm text-white/85 drop-shadow sm:text-base">
            지역과 날짜, 인원을 선택해 숙소를 찾아보세요
          </p>
        </div>
      </section>

      {/* --- 검색바: 히어로 하단에 겹치게 + 오버레이 위로 띄우기 --- */}
      <section className="relative mx-auto -mt-14 max-w-5xl px-5 pb-20 sm:-mt-20 md:-mt-24">
        <div className="relative z-30 flex justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>
    </main>
  );
}
