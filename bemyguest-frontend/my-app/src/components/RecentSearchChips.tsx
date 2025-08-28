import { useRecentSearches } from "@/hooks/useRecentSearches";
import type { SearchCond } from "@/services/recentSearch";
import { removeRecentAt, clearRecent } from "@/services/recentSearch";

type Props = {
  onSelect: (cond: SearchCond) => void;
  showTitle?: boolean;
};

function formatLabel(item: SearchCond) {
  const parts = [item.region];
  if (item.checkin && item.checkout)
    parts.push(`${item.checkin}~${item.checkout}`);
  if (item.guests) parts.push(`${item.guests}명`);
  return parts.join(" · ");
}

export default function RecentSearchChips({
  onSelect,
  showTitle = true,
}: Props) {
  const { items, reload } = useRecentSearches();
  if (items.length === 0) return null;

  const handleRemove = (idx: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    removeRecentAt(idx);
    reload();
  };

  const handleClearAll = () => {
    clearRecent();
    reload();
  };

  return (
    <div className="mt-4">
      <div className="mb-5 flex items-center justify-between">
        {showTitle && (
          <div className="text-lg font-semibold text-slate-900">최근 검색</div>
        )}

        {/* 전체 삭제 (옵션) */}
        <button
          type="button"
          onClick={handleClearAll}
          className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2"
        >
          전체 삭제
        </button>
      </div>

      {/* 세로 간격 넓힘: gap-y-4, 가로는 gap-x-3 */}
      <div className="flex flex-wrap gap-x-4 gap-y-4">
        {items.map((it, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(it)}
            className="relative flex items-center gap-2
             px-3 py-2 text-sm font-medium 
             rounded-md bg-brand-400 text-white 
             hover:bg-brand-800 transition shadow-sm"
            aria-label={`최근 검색: ${formatLabel(it)}`}
          >
            <span>{formatLabel(it)}</span>

            {/* 삭제 버튼 */}
            <span
              role="button"
              aria-label="최근 검색 삭제"
              onClick={(e) => handleRemove(idx, e)}
              className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-md
               bg-white/20 hover:bg-white/30 text-white text-xs leading-none"
            >
              ×
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
