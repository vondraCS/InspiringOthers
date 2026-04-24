import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

  const inputClass =
    'font-inter text-sm text-foreground border border-border-subtle rounded-xl px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:border-ring';

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-2">
        <h3 className="font-inter font-semibold text-base text-foreground">Account</h3>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-inter text-sm text-muted-foreground">Full name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-inter text-sm text-muted-foreground">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
            <span className="font-inter text-xs text-muted-foreground">
              Lowercase letters, numbers, and underscore. 3–20 characters.
            </span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-inter text-sm text-muted-foreground">Avatar URL</span>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-inter font-semibold text-base text-foreground">Interests</h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 max-h-40 overflow-y-auto border border-border-subtle rounded-xl p-3">
          {INTEREST_POOL.map((interest) => (
            <label
              key={interest}
              className="flex items-center gap-1.5 font-inter text-sm text-foreground cursor-pointer"
            >
              <input
                type="checkbox"
                checked={interests.includes(interest)}
                onChange={() => toggleInterest(interest)}
                className="h-4 w-4 accent-primary cursor-pointer"
              />
              {interest}
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="lg" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="default" size="lg" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
