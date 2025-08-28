import { useCallback, useEffect, useState } from "react";
import { getRecent, type SearchCond } from "@/services/recentSearch";

export function useRecentSearches() {
  const [items, setItems] = useState<SearchCond[]>([]);
  const reload = useCallback(() => setItems(getRecent()), []);

  useEffect(() => {
    reload();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "bmg_recent_searches") reload();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [reload]);

  return { items, reload };
}
