import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import { SkillLevel, type User } from '@/types';
import { toast } from '@/components/ui/toast';

const SKILL_LEVELS: SkillLevel[] = [
  SkillLevel.Beginner,
  SkillLevel.Intermediate,
  SkillLevel.Advanced,
];

const INTEREST_POOL = [
  'Photography',
  'Philosophy',
  'Cycling',
  'Mindfulness',
  'Painting',
  'Creative Writing',
  'Hiking',
  'Music Production',
  'Fitness & Strength Training',
  'Film & Cinema',
  'Cooking',
  'Travel',
  'Dance',
  'Language Learning',
  'Rock Climbing',
  'Journaling',
  'Illustration',
  'Yoga',
  'Reading',
  'Entrepreneurship',
  'Gardening',
  'Surfing',
  'Volunteering',
  'Podcasting',
  'Sculpture',
  'Running',
  'Astronomy',
  'Board Games',
  'Self-Improvement',
  'Songwriting',
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsDialog({ open, onOpenChange }: Props) {
  const currentUser = useAuthStore((s) => s.currentUser);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Settings" description="Update your profile. Changes are not persisted.">
        {!currentUser ? (
          <p className="font-inter text-sm text-black/70">Loading...</p>
        ) : (
          <SettingsForm key={String(open)} user={currentUser} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function SettingsForm({ user, onClose }: { user: User; onClose: () => void }) {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(user.skillLevel);
  const [interests, setInterests] = useState<string[]>(user.interests);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error({ title: 'Name is required' });
      return;
    }
    updateProfile({
      name: name.trim(),
      avatar: avatar.trim() || user.avatar,
      skillLevel,
      interests,
    });
    toast.success({ title: 'Settings saved' });
    onClose();
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-2">
        <h3 className="font-inter font-semibold text-base text-black">Account</h3>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-inter text-sm text-black/70">Display name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-inter text-sm text-black border border-black/20 rounded-[10px] px-3 py-2 outline-none focus:border-black/40"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-inter text-sm text-black/70">Avatar URL</span>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="font-inter text-sm text-black border border-black/20 rounded-[10px] px-3 py-2 outline-none focus:border-black/40"
            />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-inter font-semibold text-base text-black">Skill level</h3>
        <div className="flex flex-wrap gap-3">
          {SKILL_LEVELS.map((level) => (
            <label
              key={level}
              className="flex items-center gap-1.5 font-inter text-sm text-black cursor-pointer capitalize"
            >
              <input
                type="radio"
                name="skill-level"
                value={level}
                checked={skillLevel === level}
                onChange={() => setSkillLevel(level)}
              />
              {level}
            </label>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-inter font-semibold text-base text-black">Interests</h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 max-h-40 overflow-y-auto border border-black/10 rounded-[10px] p-3">
          {INTEREST_POOL.map((interest) => (
            <label
              key={interest}
              className="flex items-center gap-1.5 font-inter text-sm text-black cursor-pointer"
            >
              <input
                type="checkbox"
                checked={interests.includes(interest)}
                onChange={() => toggleInterest(interest)}
              />
              {interest}
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="font-inter text-sm text-black border border-black/20 rounded-full px-4 py-2 hover:bg-black/5 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="font-inter text-sm text-white bg-[#2ECB71] rounded-full px-4 py-2 hover:bg-[#2ECB71]/90 cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
}
