import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import { type User } from '@/types';
import { toast } from '@/components/ui/toast';

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

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
  const [fullName, setFullName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [interests, setInterests] = useState<string[]>(user.interests);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  };

  const handleSave = () => {
    if (!fullName.trim()) {
      toast.error({ title: 'Full name is required' });
      return;
    }
    if (!USERNAME_PATTERN.test(username)) {
      toast.error({ title: 'Invalid username', description: 'Lowercase letters, numbers, and underscore only (3–20 chars).' });
      return;
    }
    updateProfile({
      fullName: fullName.trim(),
      username,
      avatar: avatar.trim() || user.avatar,
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
            <span className="font-inter text-sm text-black/70">Full name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="font-inter text-sm text-black border border-black/20 rounded-[10px] px-3 py-2 outline-none focus:border-black/40"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-inter text-sm text-black/70">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="font-inter text-sm text-black border border-black/20 rounded-[10px] px-3 py-2 outline-none focus:border-black/40"
            />
            <span className="font-inter text-xs text-black/50">
              Lowercase letters, numbers, and underscore. 3–20 characters.
            </span>
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
