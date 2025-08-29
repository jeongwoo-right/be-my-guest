import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import mainImg from "../assets/main_flight.jpg";
import { pushRecent, type SearchCond } from "@/services/recentSearch";
import RecentSearchChips from "@/components/RecentSearchChips";

export default function SearchPage() {
  const navigate = useNavigate();
  const [preset, setPreset] = useState<SearchCond | null>(null);

  const handleSearch = (criteria: {
    region: string;
    startDate: string;
    endDate: string;
    guests: string;
  }) => {
    // 최근 검색 저장
    pushRecent({
      region: criteria.region,
      checkin: criteria.startDate,
      checkout: criteria.endDate,
      guests: Number(criteria.guests),
    });

    // 검색 이동
    const params = new URLSearchParams({
      startDate: criteria.startDate,
      endDate: criteria.endDate,
      guests: String(criteria.guests),
    });
    if (criteria.region) params.set("region", criteria.region);

    navigate(`/guesthouses/search?${params.toString()}`);
  };

  // 칩 클릭 시: SearchBar 초기값 + 바로 검색
  const handleSelectRecent = (cond: SearchCond) => {
    setPreset(cond); // SearchBar에 초기값 주입

    const params = new URLSearchParams({
      region: cond.region,
      startDate: cond.checkin || "",
      endDate: cond.checkout || "",
      guests: cond.guests ? String(cond.guests) : "1",
    });
    navigate(`/guesthouses/search?${params.toString()}`);
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-white to-slate-50">
      {/* --- Hero --- */}
      <section className="relative">
        <img
          src={mainImg}
          alt="하늘을 나는 비행기"
          className="h-[280px] w-full object-cover sm:h-[340px] md:h-[420px]"
        />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/30 via-black/20 to-black/30" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
          <h2 className="px-4 text-2xl font-bold text-white drop-shadow sm:text-3xl md:text-4xl">
            여행의 시작,
          </h2>
          <p className="mt-2 px-4 text-sm text-white/85 drop-shadow sm:text-base">
            Be My Guest에서 특별한 숙소를 만나보세요
          </p>
        </div>
      </section>

      {/* --- 검색바 & 최근 검색 칩 --- */}
      <section className="relative mx-auto -mt-14 max-w-5xl px-5 pb-20 sm:-mt-20 md:-mt-24">
        <div className="relative z-30 flex flex-col items-center">
          {/* SearchBar가 initialValues를 받도록만 약간 수정해줘 */}
          <SearchBar
            onSearch={handleSearch}
            initial={
              preset
                ? {
                    region: preset.region,
                    startDate: preset.checkin || "",
                    endDate: preset.checkout || "",
                    guests: preset.guests ?? 1,
                  }
                : undefined
            }
          />

          <div className="mt-5 w-full">
            <RecentSearchChips onSelect={handleSelectRecent} />
          </div>
        </div>
      </section>
    </main>
  );
}
