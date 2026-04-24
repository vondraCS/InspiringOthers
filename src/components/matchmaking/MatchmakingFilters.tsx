import { useMatchmakingStore } from '@/store/matchmakingStore';
import { cn } from '@/lib/utils';

type MatchmakingFiltersProps = {
  availableInterests: string[];
  showNearbyToggle?: boolean;
  className?: string;
};

export function MatchmakingFilters({
  availableInterests,
  showNearbyToggle = true,
  className,
}: MatchmakingFiltersProps) {
  const filters = useMatchmakingStore((s) => s.filters);
  const setFilters = useMatchmakingStore((s) => s.setFilters);

  const toggleInterest = (interest: string) => {
    const next = filters.interests.includes(interest)
      ? filters.interests.filter((i) => i !== interest)
      : [...filters.interests, interest];
    setFilters({ interests: next });
  };

  const clearAll = () => setFilters({ interests: [], nearbyOnly: false });

  const hasActiveFilters = filters.interests.length > 0 || filters.nearbyOnly;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-4 border border-border-subtle rounded-2xl bg-card',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-inter font-bold text-base text-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="font-inter text-sm text-muted-foreground hover:text-foreground underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded-sm"
          >
            Clear all
          </button>
        )}
      </div>

      {availableInterests.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="font-inter text-sm text-muted-foreground">Interests</span>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {availableInterests.map((interest) => {
              const selected = filters.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  aria-pressed={selected}
                  className={cn(
                    'font-inter text-xs rounded-full px-3 py-1 border transition-colors cursor-pointer',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
                    selected
                      ? 'bg-primary/15 border-primary text-primary font-medium'
                      : 'bg-transparent border-border-subtle text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showNearbyToggle && (
        <label className="flex items-center gap-2 font-inter text-sm text-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.nearbyOnly}
            onChange={(e) => setFilters({ nearbyOnly: e.target.checked })}
            className="h-4 w-4 accent-primary cursor-pointer"
          />
          Near me
        </label>
      )}
    </div>
  );
}
