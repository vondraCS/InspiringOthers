import { faker } from '@faker-js/faker';
import { type InterestGroup, SkillLevel } from '@/types';

const TOPICS = [
  { name: 'Street Photographers', topic: 'Photography' },
  { name: 'Philosophy Circle', topic: 'Philosophy' },
  { name: 'Weekend Cyclists', topic: 'Cycling' },
  { name: 'Mindfulness & Meditation', topic: 'Mindfulness' },
  { name: 'Creative Writers Collective', topic: 'Creative Writing' },
  { name: 'Trail Runners', topic: 'Running' },
  { name: 'Home Cooks', topic: 'Cooking' },
  { name: 'Language Exchange', topic: 'Language Learning' },
  { name: 'Sketchbook Club', topic: 'Illustration' },
  { name: 'Independent Musicians', topic: 'Music' },
];

const SKILL_LEVELS = [SkillLevel.Beginner, SkillLevel.Intermediate, SkillLevel.Advanced];

export function generateInterestGroups(userIds: string[]): InterestGroup[] {
  return TOPICS.map(({ name, topic }) => ({
    id: faker.string.uuid(),
    name,
    topic,
    skillLevel: faker.helpers.arrayElement(SKILL_LEVELS),
    memberIds: faker.helpers.arrayElements(userIds, { min: 5, max: 20 }),
  }));
}
