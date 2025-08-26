import React, { useEffect, useRef, useState } from "react";
import { format, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Calendar as CalendarIcon, MapPin, Users } from "lucide-react";

type SearchBarProps = {
  onSearch: (criteria: {
    region: string;
    startDate: string;
    endDate: string;
    guests: string;
  }) => void;
  initial?: {
    region?: string;
    startDate?: string; // yyyy-MM-dd
    endDate?: string; // yyyy-MM-dd
    guests?: number;
  };
};

const REGIONS = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
] as const;

const STORAGE_KEY = "bmg:search";

export default function SearchBar({ onSearch, initial }: SearchBarProps) {
  const [region, setRegion] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [calendarKey, setCalendarKey] = useState(0);

  const startDate = range?.from ? format(range.from, "yyyy-MM-dd") : "";
  const endDate = range?.to ? format(range.to, "yyyy-MM-dd") : "";

  const dateError =
    startDate && endDate && new Date(startDate) >= new Date(endDate)
      ? "체크아웃은 체크인 다음 날 이후여야 해요."
      : "";
  const canSearch =
    !!region && !!startDate && !!endDate && !dateError && guests >= 1;

  // 날짜 클릭 로직(완전 제어) + 동일 날짜 재클릭 무시 + 재선택 시 완전 리셋
  const handleDayClick = (day: Date, _mod?: any, e?: React.MouseEvent) => {
    if (range?.from && !range?.to && isSameDay(day, range.from)) {
      e?.preventDefault?.();
      return;
    }
    setRange((prev) => {
      if (!prev || (!prev.from && !prev.to))
        return { from: day, to: undefined };
      if (prev.from && !prev.to) {
        if (day <= prev.from) return { from: day, to: undefined };
        return { from: prev.from, to: day };
      }
      // 시작/끝 모두 있었는데 다시 누르면 새 시작으로 리셋 + 리마운트
      setCalendarKey((k) => k + 1);
      return { from: day, to: undefined };
    });
  };

  // 최초 1회: URL(initial) 우선 적용, 없으면 localStorage 복원
  const didHydrate = useRef(false);
  useEffect(() => {
    if (didHydrate.current) return;
    if (initial) {
      if (initial.region) setRegion(initial.region);
      const from = initial.startDate ? new Date(initial.startDate) : undefined;
      const to = initial.endDate ? new Date(initial.endDate) : undefined;
      if (from || to) setRange({ from, to });
      if (typeof initial.guests === "number")
        setGuests(Math.max(1, initial.guests));
      didHydrate.current = true;
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          region?: string;
          startDate?: string;
          endDate?: string;
          guests?: number;
        };
        if (saved.region) setRegion(saved.region);
        if (typeof saved.guests === "number")
          setGuests(Math.max(1, saved.guests));
        const from = saved.startDate ? new Date(saved.startDate) : undefined;
        const to = saved.endDate ? new Date(saved.endDate) : undefined;
        if (from || to) setRange({ from, to });
      }
    } catch {}
    didHydrate.current = true;
  }, [initial]);

  // 값 변경 시 저장
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ region, startDate, endDate, guests })
      );
    } catch {}
  }, [region, startDate, endDate, guests]);

  const handleSearch = () => {
    if (!canSearch) return;
    onSearch({ region, startDate, endDate, guests: String(guests) });
  };

  const dateLabel =
    startDate && endDate
      ? `${startDate} ~ ${endDate}`
      : startDate
      ? `${startDate} ~ 체크아웃`
      : "체크인 - 체크아웃";

  return (
    <div className="flex justify-center mx-auto mb-6 w-full">
      <div className="flex w-full max-w-[980px] items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg flex-wrap md:flex-nowrap">
        {/* 지역 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 flex-1 rounded-xl border-slate-200 bg-white text-slate-700 justify-start px-4"
            >
              <MapPin className="mr-2 h-4 w-4" />
              <span className="truncate">{region || "지역"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            sideOffset={8}
            avoidCollisions={false}
            className="z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl w-[420px] sm:w-[520px] max-w-[calc(100vw-2rem)]"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`w-full text-center px-3 py-2 rounded-full border text-sm transition ${
                    region === r
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-white text-slate-700 border-slate-300 hover:border-brand-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* 날짜 (범위 선택) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 flex-[2] rounded-xl border-slate-200 bg-white text-slate-700 justify-start px-4"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="truncate">{dateLabel}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            sideOffset={8}
            avoidCollisions={false}
            className="z-50 w-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-xl"
          >
            <Calendar
              key={calendarKey}
              mode="range"
              numberOfMonths={2}
              selected={range}
              onDayClick={handleDayClick}
              defaultMonth={range?.from ?? new Date()}
              disabled={(d) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return d < today;
              }}
              className="rounded-2xl bg-white"
            />
          </PopoverContent>
        </Popover>

        {/* 인원 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 flex-1 rounded-xl border-slate-200 bg-white text-slate-700 justify-start px-4"
            >
              <Users className="mr-2 h-4 w-4" />
              {`인원 ${guests}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            sideOffset={8}
            avoidCollisions={false}
            className="z-50 w-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="h-9 w-9 rounded-full border-0 grid place-items-center"
                aria-label="decrease guests"
              >
                –
              </button>
              <span className="min-w-10 text-center font-medium tabular-nums">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(99, g + 1))}
                className="h-9 w-9 rounded-full border-0 grid place-items-center"
                aria-label="increase guests"
              >
                +
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* 검색 */}
        <Button
          onClick={handleSearch}
          disabled={!canSearch}
          className={`h-10 shrink-0 px-6 rounded-xl bg-brand-600 text-white hover:bg-brand-700 ${
            !canSearch ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          검색
        </Button>
      </div>

      {dateError && (
        <p className="mt-2 w-full text-center text-sm text-rose-600">
          {dateError}
        </p>
      )}
    </div>
  );
}
