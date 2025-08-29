import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { pushRecent } from "@/services/recentSearch";

import { searchGuesthouses } from "../services/guesthouseService";
import type {
  Guesthouse,
  GuesthouseSearchRequest,
} from "../services/guesthouseService";

import SearchBar from "../components/SearchBar";
import GuesthouseList from "../components/GuesthouseList";
import Pagination from "../components/Pagination";

const GuesthouseListPage: React.FC = () => {
  const [guesthouses, setGuesthouses] = useState<Guesthouse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [sort, setSort] = useState<"rating" | "price" | "name">("rating");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ 쿼리값은 렌더 스코프에서 파싱 (JSX에서도 사용 가능)
  const region = searchParams.get("region") || "";

  const startDateParam =
    searchParams.get("startDate") || searchParams.get("start") || "";
  const endDateParam =
    searchParams.get("endDate") || searchParams.get("end") || "";

  const rawGuests = searchParams.get("guests");
  const guestsParam = (() => {
    if (rawGuests == null) return 1;
    const g = Number(String(rawGuests).trim());
    return Number.isFinite(g) && g >= 1 ? g : 1;
  })();

  useEffect(() => {
    // URL에서 sort/dir 싱크
    const sortParam =
      (searchParams.get("sort") as "rating" | "price" | "name") || undefined;
    const dirParam = (searchParams.get("dir") as "asc" | "desc") || undefined;
    if (sortParam && sortParam !== sort) setSort(sortParam);
    if (dirParam && dirParam !== dir) setDir(dirParam);

    if (!region) return;

    const loadGuesthouses = async () => {
      setIsLoading(true);

      const searchRequest: GuesthouseSearchRequest = {
        region,
        startDate: startDateParam,
        endDate: endDateParam,
        guests: guestsParam,
        page: currentPage - 1,
        size: 10,
        sort,
        dir,
      };

      const response = await searchGuesthouses(searchRequest);
      setGuesthouses(response.content);
      setTotalPages(response.totalPages);
      setIsLoading(false);
    };

    loadGuesthouses();
    // region/start/end/guests가 바뀌면 재조회
  }, [
    searchParams,
    region,
    startDateParam,
    endDateParam,
    guestsParam,
    currentPage,
  ]);

  useEffect(() => {
    // 현재 URL의 파라미터를 가져와서 복사
    const newSearchParams = new URLSearchParams(searchParams.toString());
    // sort와 dir 파라미터를 새로운 상태값으로 설정 (또는 덮어쓰기)
    newSearchParams.set("sort", sort);
    newSearchParams.set("dir", dir);
    // URL 업데이트 (이 작업은 위의 API 호출 useEffect를 다시 트리거합니다)
    setSearchParams(newSearchParams);
  }, [sort, dir]); // sort나 dir 상태가 변경될 때만 이 effect를 실행

  const handleSearch = (criteria: {
    region: string;
    startDate: string;
    endDate: string;
    guests: string; // number 타입으로 받는 것이 좋습니다. SearchBar에서 변환 필요
  }) => {
    pushRecent({
      region: criteria.region,
      checkin: criteria.startDate,
      checkout: criteria.endDate,
      guests: Number(criteria.guests),
    });

    setSearchParams({
      region: criteria.region,
      startDate: criteria.startDate,
      endDate: criteria.endDate,
      guests: String(criteria.guests),
      // sort와 dir은 별도의 useEffect가 관리하므로 여기서 제거
    });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-5 pt-10">
      <div className="flex justify-center">
        <SearchBar
          onSearch={handleSearch}
          initial={{
            region: region || undefined,
            startDate: startDateParam || undefined,
            endDate: endDateParam || undefined,
            guests: guestsParam,
          }}
        />
      </div>

      <div className="mt-6 mb-3 flex items-center gap-2 justify-end text-sm">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="h-9 rounded-lg border border-slate-300 px-2"
        >
          <option value="rating">평점순</option>
          <option value="price">가격순</option>
          <option value="name">이름순</option>
        </select>
        <select
          value={dir}
          onChange={(e) => setDir(e.target.value as any)}
          className="h-9 rounded-lg border border-slate-300 px-2"
        >
          <option value="desc">내림차순</option>
          <option value="asc">오름차순</option>
        </select>
      </div>

      <GuesthouseList guesthouses={guesthouses} isLoading={isLoading} />

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
};

export default GuesthouseListPage;
