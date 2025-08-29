export type SearchCond = {
  region: string;
  checkin: string; // yyyy-MM-dd
  checkout: string; // yyyy-MM-dd
  guests: number;
};

const RECENT_KEY = "bmg:recent";
const MAX = 6;

function broadcast() {
  try {
    window.dispatchEvent(new Event("recent-changed"));
  } catch {}
}

function read(): SearchCond[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(list: SearchCond[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX)));
    broadcast();
  } catch {}
}

export function getRecent(): SearchCond[] {
  return read();
}

export function pushRecent(cond: SearchCond) {
  const list = read();
  const idx = list.findIndex(
    (x) =>
      x.region === cond.region &&
      x.checkin === cond.checkin &&
      x.checkout === cond.checkout &&
      x.guests === cond.guests
  );
  if (idx >= 0) {
    const [hit] = list.splice(idx, 1);
    list.unshift(hit);
  } else {
    list.unshift(cond);
  }
  write(list);
}

export function removeRecentAt(index: number) {
  const list = read();
  if (index < 0 || index >= list.length) return;
  list.splice(index, 1);
  write(list);
}

export function clearRecent() {
  try {
    localStorage.removeItem(RECENT_KEY);
    broadcast();
  } catch {}
}
