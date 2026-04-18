import { faker } from '@faker-js/faker';
import { type LocalEvent } from '@/types';

const EVENT_TITLES = [
  'Photography walk in the old town',
  'Open mic & songwriters circle',
  'Sunrise hike + journaling',
  'Indie film screening and discussion',
  'Creative writing workshop',
  'Beginner pottery night',
  'Community run club: 5K easy pace',
  'Cooking together: a shared meal',
  'Drawing from life — bring a sketchbook',
  'Mindful meditation in the park',
  'Book club: short fiction edition',
  'Founders coffee meetup',
];

const VENUES = [
  'The Commons',
  'Riverside Park',
  'North Street Library',
  'Maker Studio',
  'Old Town Square',
  'The Loft',
  'Community Garden',
  'Lakeside Pavilion',
];

export function generateLocalEvents(count: number): LocalEvent[] {
  const titles = faker.helpers.arrayElements(EVENT_TITLES, { min: count, max: count });
  return titles.map((title) => ({
    id: faker.string.uuid(),
    title,
    date: faker.date.soon({ days: 30 }).toISOString(),
    location: `${faker.helpers.arrayElement(VENUES)}, ${faker.location.city()}`,
    description: faker.lorem.sentences({ min: 1, max: 2 }),
  }));
}
