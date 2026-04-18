import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { SkillLevel } from '@/types';
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

const schema = z.object({
  interests: z.array(z.string()).min(1, 'Pick at least one interest'),
  skillLevel: z.enum([SkillLevel.Beginner, SkillLevel.Intermediate, SkillLevel.Advanced]),
  location: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Onboarding() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const isLoaded = useAuthStore((s) => s.isLoaded);
  const initialize = useAuthStore((s) => s.initialize);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  useEffect(() => {
    if (!isLoaded) initialize();
  }, [isLoaded, initialize]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      interests: [],
      skillLevel: SkillLevel.Beginner,
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

  const onSubmit = (values: FormValues) => {
    updateProfile({
      interests: values.interests,
      skillLevel: values.skillLevel,
      location: values.location?.trim() || currentUser?.location || '',
    });
    localStorage.setItem(ONBOARDED_KEY, '1');
    toast.success({ title: `Welcome${currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''}!` });
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Logo size="lg" />
          <h1 className="font-raleway font-bold text-2xl text-black">Welcome — tell us about you</h1>
          <p className="font-inter text-sm text-black/70 text-center">
            We use this to match you with peers at a similar stage.
          </p>
        </div>

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
            <h2 className="font-inter font-semibold text-base text-black">Skill level</h2>
            <div className="flex flex-wrap gap-3">
              {[SkillLevel.Beginner, SkillLevel.Intermediate, SkillLevel.Advanced].map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-1.5 font-inter text-sm text-black cursor-pointer capitalize"
                >
                  <input type="radio" value={level} {...register('skillLevel')} />
                  {level}
                </label>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <label className="flex flex-col gap-1">
              <span className="font-inter font-semibold text-base text-black">
                Location <span className="font-normal text-black/50">(optional)</span>
              </span>
              <input
                type="text"
                placeholder="City, Country"
                {...register('location')}
                className="font-inter text-sm text-black border border-black/20 rounded-[10px] px-3 py-2 outline-none focus:border-black/40"
              />
            </label>
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
      </div>
    </div>
  );
}
