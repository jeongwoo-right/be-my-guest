import { useCallback, useEffect, useState } from "react";
import { getRecent, type SearchCond } from "@/services/recentSearch";

export function useRecentSearches() {
  const [items, setItems] = useState<SearchCond[]>(() => getRecent());

  const reload = useCallback(() => {
    setItems(getRecent());
  }, []);

  useEffect(() => {
    const onChange = () => reload();
    window.addEventListener("recent-changed", onChange);
    return () => window.removeEventListener("recent-changed", onChange);
  }, [reload]);

  return { items, reload };
}
