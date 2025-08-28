export type SearchCond = {
  region: string; // 내부적으로는 Region enum의 key나 displayName 사용
  checkin?: string; // 'YYYY-MM-DD'
  checkout?: string; // 'YYYY-MM-DD'
  guests?: number;
};

type StoredItem = SearchCond & { savedAt: number }; // ms timestamp

const KEY = "bmg_recent_searches";
const MAX_ITEMS = 6;
const EXPIRE_DAYS = 7;

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function isExpired(savedAt: number) {
  const ms = EXPIRE_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - savedAt > ms;
}

function normalize(cond: SearchCond): SearchCond {
  // 필요 시 region 트림/대소문자 정규화
  return {
    ...cond,
    region: cond.region.trim(),
  };
}

function sameCond(a: SearchCond, b: SearchCond) {
  return (
    a.region === b.region &&
    (a.checkin || "") === (b.checkin || "") &&
    (a.checkout || "") === (b.checkout || "") &&
    (a.guests || 0) === (b.guests || 0)
  );
}

export function pushRecent(cond: SearchCond) {
  if (typeof window === "undefined") return;
  const arr = safeParse<StoredItem[]>(localStorage.getItem(KEY), []);
  const norm = normalize(cond);

  const filtered = arr.filter((item) => !isExpired(item.savedAt));

  const dedup = filtered.filter((item) => !sameCond(item, norm));

  const next: StoredItem[] = [{ ...norm, savedAt: Date.now() }, ...dedup].slice(
    0,
    MAX_ITEMS
  );
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function getRecent(): SearchCond[] {
  if (typeof window === "undefined") return [];
  const arr = safeParse<StoredItem[]>(localStorage.getItem(KEY), []);
  const alive = arr.filter((item) => !isExpired(item.savedAt));
  // 만료 정리 반영
  if (alive.length !== arr.length) {
    localStorage.setItem(KEY, JSON.stringify(alive));
  }
  return alive;
}

export function removeRecentAt(index: number) {
  if (typeof window === "undefined") return;
  const arr = safeParse<StoredItem[]>(localStorage.getItem(KEY), []);
  if (index < 0 || index >= arr.length) return;
  arr.splice(index, 1);
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function clearRecent() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
