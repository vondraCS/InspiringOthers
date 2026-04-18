import { faker } from '@faker-js/faker';
import { type Post } from '@/types';

const TAGS = [
  'photography',
  'philosophy',
  'cycling',
  'mindfulness',
  'creative-writing',
  'fitness',
  'travel',
  'music',
  'self-improvement',
  'cooking',
  'language-learning',
  'storytelling',
  'art',
  'running',
  'reflection',
  'community',
  'beginners',
  'long-form',
  'opinion',
  'journal',
];

const SUBJECTS = [
  'photography',
  'cycling',
  'mindfulness',
  'creative writing',
  'running',
  'philosophy',
  'travel',
  'cooking',
  'painting',
  'music',
  'language learning',
  'rock climbing',
  'journaling',
  'yoga',
  'storytelling',
  'self-improvement',
  'dance',
  'hiking',
  'illustration',
  'community-building',
];

const VERBS_PAST = [
  'started',
  'picked up',
  'committed to',
  'fell in love with',
  'struggled with',
  'rediscovered',
  'finally tried',
  'almost quit',
];

function generateTitle(): string {
  const subject = faker.helpers.arrayElement(SUBJECTS);
  const templates = [
    () => `How I ${faker.helpers.arrayElement(VERBS_PAST)} ${subject} and what I learned`,
    () => `${faker.number.int({ min: 3, max: 10 })} things I wish I knew before starting ${subject}`,
    () => `Why ${subject} changed the way I see the world`,
    () => `A beginner's honest account of learning ${subject}`,
    () => `What ${faker.number.int({ min: 6, max: 24 })} months of ${subject} taught me about patience`,
    () => `The quiet joy of ${subject} — and why more people should try it`,
    () => `I gave ${subject} one month. Here's what happened.`,
    () => `Finding community through ${subject}`,
    () => `On ${subject}, creative blocks, and getting unstuck`,
    () => `Why I stopped treating ${subject} as a productivity tool`,
  ];
  return faker.helpers.arrayElement(templates)();
}

export function generatePosts(count: number, userIds: string[]): Post[] {
  return Array.from({ length: count }, () => {
    const id = faker.string.uuid();
    return {
      id,
      authorId: faker.helpers.arrayElement(userIds),
      title: generateTitle(),
      body: faker.lorem.paragraphs({ min: 4, max: 8 }, '\n\n'),
      coverImage: `https://picsum.photos/seed/${id}/800/600`,
      createdAt: faker.date.recent({ days: 60 }).toISOString(),
      tags: faker.helpers.arrayElements(TAGS, { min: 2, max: 5 }),
    };
  });
}
