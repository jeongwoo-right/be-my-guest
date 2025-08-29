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

  // URL 파라미터 파싱
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

  // 데이터 로드 + URL -> state 단방향 동기화 (정렬은 URL을 기준으로)
  useEffect(() => {
    const sortParam =
      (searchParams.get("sort") as "rating" | "price" | "name") || "rating";
    const dirParam = (searchParams.get("dir") as "asc" | "desc") || "desc";

    // 로컬 state는 URL과 다를 때만 갱신 (불필요 렌더 방지)
    if (sort !== sortParam) setSort(sortParam);
    if (dir !== dirParam) setDir(dirParam);

    const load = async () => {
      setIsLoading(true);

      const req: any = {
        startDate: startDateParam,
        endDate: endDateParam,
        guests: guestsParam,
        page: currentPage - 1,
        size: 9,
        sort: sortParam,
        dir: dirParam,
      };
      if (region) req.region = region; // region 없으면 전체 검색

      const res = await searchGuesthouses(req as GuesthouseSearchRequest);
      setGuesthouses(res.content);
      setTotalPages(res.totalPages);
      setIsLoading(false);
    };

    load();
  }, [
    // URL이 바뀌거나 페이지가 바뀔 때만 재조회 (로컬 sort/dir은 URL로부터 동기화됨)
    searchParams,
    currentPage,
    region,
    startDateParam,
    endDateParam,
    guestsParam,
  ]);

  // 정렬 변경 핸들러: onChange에서 URL을 직접 업데이트(이펙트로 또 안 만짐)
  const handleSortChange = (nextSort: "rating" | "price" | "name") => {
    if (sort === nextSort) return; // 동일값이면 스킵
    setSort(nextSort);

    const next = new URLSearchParams(searchParams.toString());
    if (next.get("sort") !== nextSort) next.set("sort", nextSort);
    // URL이 실제로 바뀌는 경우에만 set
    setSearchParams(next);
    setCurrentPage(1);
    window.scrollTo(0, 0);
  };

  const handleDirChange = (nextDir: "asc" | "desc") => {
    if (dir === nextDir) return;
    setDir(nextDir);

    const next = new URLSearchParams(searchParams.toString());
    if (next.get("dir") !== nextDir) next.set("dir", nextDir);
    setSearchParams(next);
    setCurrentPage(1);
    window.scrollTo(0, 0);
  };

  const handleSearch = (criteria: {
    region: string;
    startDate: string;
    endDate: string;
    guests: string;
  }) => {
    // 최근검색 (서비스에서 최대 6개 유지)
    pushRecent({
      region: criteria.region,
      checkin: criteria.startDate,
      checkout: criteria.endDate,
      guests: Number(criteria.guests),
    });

    // region 비어있으면 파라미터 제외 → 전체 지역
    const params = new URLSearchParams({
      startDate: criteria.startDate,
      endDate: criteria.endDate,
      guests: String(criteria.guests),
    });
    if (criteria.region) params.set("region", criteria.region);

    // 정렬 파라미터는 유지
    if (searchParams.get("sort")) params.set("sort", searchParams.get("sort")!);
    if (searchParams.get("dir")) params.set("dir", searchParams.get("dir")!);

    setSearchParams(params);

    // 상세 페이지 fallback
    sessionStorage.setItem(
      "search:last",
      JSON.stringify({
        startDate: criteria.startDate,
        endDate: criteria.endDate,
        guests: Number(criteria.guests) || 1,
      })
    );

    setCurrentPage(1);
    window.scrollTo(0, 0);
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
          onChange={(e) => handleSortChange(e.target.value as any)}
          className="h-9 rounded-lg border border-slate-300 px-2"
        >
          <option value="rating">평점순</option>
          <option value="price">가격순</option>
          <option value="name">이름순</option>
        </select>
        <select
          value={dir}
          onChange={(e) => handleDirChange(e.target.value as any)}
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
