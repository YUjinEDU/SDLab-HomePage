"use client";

type FilterBarProps = {
  filters: { key: string; label: string; options: string[] }[];
  selected: Record<string, string>;
  onChange: (key: string, value: string) => void;
};

export function FilterBar({ filters, selected, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <label
            htmlFor={`filter-${filter.key}`}
            className="text-sm text-text-secondary whitespace-nowrap"
          >
            {filter.label}
          </label>
          <select
            id={`filter-${filter.key}`}
            value={selected[filter.key] || ""}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          >
            <option value="">전체</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
