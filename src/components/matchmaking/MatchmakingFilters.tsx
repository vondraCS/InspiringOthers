import { useMatchmakingStore } from '@/store/matchmakingStore';
import { SkillLevel } from '@/types';
import { cn } from '@/lib/utils';

type MatchmakingFiltersProps = {
  availableInterests: string[];
  showNearbyToggle?: boolean;
  className?: string;
};

const SKILL_LEVEL_OPTIONS: SkillLevel[] = [
  SkillLevel.Beginner,
  SkillLevel.Intermediate,
  SkillLevel.Advanced,
];

export function MatchmakingFilters({
  availableInterests,
  showNearbyToggle = true,
  className,
}: MatchmakingFiltersProps) {
  const filters = useMatchmakingStore((s) => s.filters);
  const setFilters = useMatchmakingStore((s) => s.setFilters);

  const toggleSkill = (level: SkillLevel) => {
    const next = filters.skillLevels.includes(level)
      ? filters.skillLevels.filter((l) => l !== level)
      : [...filters.skillLevels, level];
    setFilters({ skillLevels: next });
  };

  const toggleInterest = (interest: string) => {
    const next = filters.interests.includes(interest)
      ? filters.interests.filter((i) => i !== interest)
      : [...filters.interests, interest];
    setFilters({ interests: next });
  };

  const clearAll = () => setFilters({ skillLevels: [], interests: [], nearbyOnly: false });

  const hasActiveFilters =
    filters.skillLevels.length > 0 || filters.interests.length > 0 || filters.nearbyOnly;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-4 border border-black/15 rounded-[15px]',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-inter font-bold text-base text-black">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="font-inter text-sm text-black/70 hover:text-black underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-inter text-sm text-black/70">Skill level</span>
        <div className="flex flex-wrap gap-3">
          {SKILL_LEVEL_OPTIONS.map((level) => (
            <label
              key={level}
              className="flex items-center gap-1.5 font-inter text-sm text-black cursor-pointer capitalize"
            >
              <input
                type="checkbox"
                checked={filters.skillLevels.includes(level)}
                onChange={() => toggleSkill(level)}
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      {availableInterests.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="font-inter text-sm text-black/70">Interests</span>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 max-h-32 overflow-y-auto">
            {availableInterests.map((interest) => (
              <label
                key={interest}
                className="flex items-center gap-1.5 font-inter text-sm text-black cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                />
                {interest}
              </label>
            ))}
          </div>
        </div>
      )}

      {showNearbyToggle && (
        <label className="flex items-center gap-1.5 font-inter text-sm text-black cursor-pointer">
          <input
            type="checkbox"
            checked={filters.nearbyOnly}
            onChange={(e) => setFilters({ nearbyOnly: e.target.checked })}
          />
          Near me
        </label>
      )}
    </div>
  );
}
