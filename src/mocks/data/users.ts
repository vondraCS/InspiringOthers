import { faker } from '@faker-js/faker';
import { type User } from '@/types';

const INTERESTS = [
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

const GOALS = [
  'Publish my first photo series',
  'Run a half marathon',
  'Learn a new language',
  'Start a daily journaling practice',
  'Write and publish a short story',
  'Find a creative community to grow with',
  'Travel somewhere completely new',
  'Learn to play an instrument',
  'Build a consistent meditation habit',
  'Spend more time outdoors',
  'Share my work with a wider audience',
  'Connect with people who share my passions',
  'Turn a hobby into a side project',
  'Get comfortable performing in public',
  'Finish a creative project I started',
  'Learn to cook a new cuisine',
  'Become more physically active',
  'Read 20 books this year',
  'Take a course in something outside my comfort zone',
  'Build a body of work I am proud of',
];

export function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => {
    const id = faker.string.uuid();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const rawUsername = faker.internet
      .username({ firstName, lastName })
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 20);
    const username = rawUsername.length >= 3 ? rawUsername : `${rawUsername}_user`.slice(0, 20);
    return {
      id,
      fullName: `${firstName} ${lastName}`,
      username,
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      interests: faker.helpers.arrayElements(INTERESTS, { min: 2, max: 5 }),
      location: `${faker.location.city()}, ${faker.location.country()}`,
      goals: faker.helpers.arrayElements(GOALS, { min: 1, max: 3 }),
    };
  });
}
