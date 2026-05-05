import { FiFilter } from "react-icons/fi";

const TYPES = [{ value: "all", label: "All" }, { value: "movie", label: "Movies" }, { value: "tv", label: "TV" }];
const SORT_BY = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "release_date.desc", label: "Newest" },
];

export default function FilterPanel({ filters, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FiFilter className="text-pixelplay-muted" />
      <div className="flex gap-1 bg-pixelplay-surface rounded-lg p-1">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => onChange({ type: t.value })}
            className={`filter-tab ${filters.type === t.value ? "active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <select
        value={filters.sortBy}
        onChange={(e) => onChange({ sortBy: e.target.value })}
        className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 cursor-pointer">
        {SORT_BY.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
    </div>
  );
}