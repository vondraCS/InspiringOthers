import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Logo } from '@/components/layout/Logo';
import { toast } from '@/components/ui/toast';

export const ONBOARDED_KEY = 'io-onboarded';

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
];

const profileSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  username: z
    .string()
    .trim()
    .regex(/^[a-z0-9_]{3,20}$/, 'Lowercase letters, numbers, underscore only (3–20 chars)'),
});

const interestsSchema = z.object({
  interests: z.array(z.string()).min(1, 'Pick at least one interest'),
  location: z.string().trim().min(1, 'Location is required'),
});

type ProfileValues = z.infer<typeof profileSchema>;
type InterestsValues = z.infer<typeof interestsSchema>;

export default function Onboarding() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const isLoaded = useAuthStore((s) => s.isLoaded);
  const initialize = useAuthStore((s) => s.initialize);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [step, setStep] = useState<'profile' | 'interests'>('profile');
  const [profile, setProfile] = useState<ProfileValues | null>(null);

  useEffect(() => {
    if (!isLoaded) initialize();
  }, [isLoaded, initialize]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Logo size="lg" />
          <h1 className="font-raleway font-bold text-2xl text-black">Welcome — tell us about you</h1>
          <p className="font-inter text-sm text-black/70 text-center">
            {step === 'profile'
              ? 'Set up your display name and username.'
              : 'We use this to match you with peers at a similar stage.'}
          </p>
        </div>

        {step === 'profile' ? (
          <ProfileStep
            initial={profile ?? { fullName: currentUser?.fullName ?? '', username: currentUser?.username ?? '' }}
            onContinue={(values) => {
              setProfile(values);
              setStep('interests');
            }}
          />
        ) : (
          <InterestsStep
            onBack={() => setStep('profile')}
            onSubmit={(values) => {
              if (!profile) {
                setStep('profile');
                return;
              }
              updateProfile({
                fullName: profile.fullName,
                username: profile.username,
                interests: values.interests,
                location: values.location.trim(),
              });
              localStorage.setItem(ONBOARDED_KEY, '1');
              toast.success({ title: `Welcome, ${profile.fullName.split(' ')[0]}!` });
              navigate('/', { replace: true });
            }}
          />
        )}
      </div>
    </div>
  );
}

function ProfileStep({
  initial,
  onContinue,
}: {
  initial: ProfileValues;
  onContinue: (values: ProfileValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initial,
  });

  return (
    <form
      onSubmit={handleSubmit(onContinue)}
      className="flex flex-col gap-5 border border-black/15 rounded-[15px] p-6"
    >
      <section className="flex flex-col gap-2">
        <label className="flex flex-col gap-1">
          <span className="font-inter font-semibold text-base text-black">Full name</span>
          <input
            type="text"
            placeholder="Jane Rivera"
            {...register('fullName')}
            className="font-inter text-sm text-black border border-black/20 rounded-[10px] px-3 py-2 outline-none focus:border-black/40"
          />
        </label>
        {errors.fullName && (
          <p className="font-inter text-xs text-red-600">{errors.fullName.message}</p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <label className="flex flex-col gap-1">
          <span className="font-inter font-semibold text-base text-black">Username</span>
          <input
            type="text"
            placeholder="jane_r"
            {...register('username')}
            className="font-inter text-sm text-black border border-black/20 rounded-[10px] px-3 py-2 outline-none focus:border-black/40"
          />
          <span className="font-inter text-xs text-black/50">
            Lowercase letters, numbers, and underscore. 3–20 characters.
          </span>
        </label>
        {errors.username && (
          <p className="font-inter text-xs text-red-600">{errors.username.message}</p>
        )}
      </section>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="font-inter text-sm text-white bg-[#2ECB71] rounded-full px-5 py-2 hover:bg-[#2ECB71]/90 disabled:opacity-60 cursor-pointer"
        >
          Continue
        </button>
      </div>
    </form>
  );
}

function InterestsStep({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (values: InterestsValues) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InterestsValues>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      interests: [],
      location: '',
    },
  });

  const selectedInterests = watch('interests');

  const toggleInterest = (interest: string) => {
    const next = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setValue('interests', next, { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 border border-black/15 rounded-[15px] p-6"
    >
      <section className="flex flex-col gap-2">
        <h2 className="font-inter font-semibold text-base text-black">Interests</h2>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 max-h-48 overflow-y-auto">
          {INTEREST_POOL.map((interest) => (
            <label
              key={interest}
              className="flex items-center gap-1.5 font-inter text-sm text-black cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedInterests.includes(interest)}
                onChange={() => toggleInterest(interest)}
              />
              {interest}
            </label>
          ))}
        </div>
        {errors.interests && (
          <p className="font-inter text-xs text-red-600">{errors.interests.message}</p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <label className="flex flex-col gap-1">
          <span className="font-inter font-semibold text-base text-black">
            Location
          </span>
          <input
            type="text"
            placeholder="City, Country"
            {...register('location')}
            className="font-inter text-sm text-black border border-black/20 rounded-[10px] px-3 py-2 outline-none focus:border-black/40"
          />
        </label>
        {errors.location && (
          <p className="font-inter text-xs text-red-600">{errors.location.message}</p>
        )}
      </section>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="font-inter text-sm text-black border border-black/20 rounded-full px-4 py-2 hover:bg-black/5 cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="font-inter text-sm text-white bg-[#2ECB71] rounded-full px-5 py-2 hover:bg-[#2ECB71]/90 disabled:opacity-60 cursor-pointer"
        >
          Finish
        </button>
      </div>
    </form>
  );
}
