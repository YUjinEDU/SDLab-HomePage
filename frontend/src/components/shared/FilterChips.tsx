"use client";

interface FilterChipsProps {
  chips: { key: string; label: string; value: string }[];
  onRemove: (key: string) => void;
  onClear: () => void;
}

export function FilterChips({ chips, onRemove, onClear }: FilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary-muted text-primary"
        >
          <span className="text-text-secondary text-xs">{chip.label}:</span>
          {chip.value}
          <button
            onClick={() => onRemove(chip.key)}
            className="ml-1 hover:text-primary/70 transition-colors"
            aria-label={`${chip.value} 필터 제거`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </span>
      ))}
      <button
        onClick={onClear}
        className="text-sm text-text-secondary hover:text-foreground transition-colors"
      >
        전체 해제
      </button>
    </div>
  );
}
