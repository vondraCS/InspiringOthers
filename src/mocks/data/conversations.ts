import { faker } from '@faker-js/faker';
import { type Conversation, type ChatMessage, type User } from '@/types';

const CHANNEL_NAMES = [
  '#javascript',
  '#react',
  '#career-advice',
  '#open-source',
  '#machine-learning',
  '#design',
  '#devops',
  '#general',
];

const GROUP_NAMES = [
  'Weekend Study Jam',
  'Portfolio Review Crew',
  'Frontend Friends',
  'Tuesday Code Club',
  'Side Project Squad',
  'Design Critique Circle',
  'Interview Prep Group',
  'Coffee & Code',
  'ML Study Buddies',
  'Build in Public',
  'React Learners',
  'Hackathon Team',
  'Pair Programming Pals',
  'Career Switchers',
  'Open Source Circle',
];

export function generateConversations(users: User[]): Conversation[] {
  const currentUser = users[0];
  const otherUsers = users.slice(1);
  const conversations: Conversation[] = [];

  // DMs: current user + one other
  for (let i = 0; i < 6; i++) {
    const other = otherUsers[i];
    conversations.push({
      id: faker.string.uuid(),
      type: 'dm',
      participantIds: [currentUser.id, other.id],
      name: other.fullName,
    });
  }

  // Groups: current user + 2-4 others
  const groupNames = faker.helpers.arrayElements(GROUP_NAMES, 4);
  for (let i = 0; i < 4; i++) {
    const members = faker.helpers.arrayElements(otherUsers, { min: 2, max: 4 });
    conversations.push({
      id: faker.string.uuid(),
      type: 'group',
      participantIds: [currentUser.id, ...members.map((u) => u.id)],
      name: groupNames[i],
    });
  }

  // Channels
  for (const name of faker.helpers.arrayElements(CHANNEL_NAMES, 4)) {
    const members = faker.helpers.arrayElements(users, { min: 5, max: 15 });
    if (!members.find((u) => u.id === currentUser.id)) {
      members.push(currentUser);
    }
    conversations.push({
      id: faker.string.uuid(),
      type: 'channel',
      participantIds: members.map((u) => u.id),
      name,
    });
  }

  return conversations;
}

export function generateMessages(
  conversations: Conversation[],
  users: User[],
): Record<string, ChatMessage[]> {
  const usersById = Object.fromEntries(users.map((u) => [u.id, u]));
  const result: Record<string, ChatMessage[]> = {};

  for (const conv of conversations) {
    const count = faker.number.int({ min: 5, max: 20 });
    const messages: ChatMessage[] = [];
    let time = faker.date.recent({ days: 7 });

    for (let i = 0; i < count; i++) {
      const authorId = faker.helpers.arrayElement(
        conv.participantIds.filter((id) => usersById[id]),
      );
      time = new Date(time.getTime() + faker.number.int({ min: 60_000, max: 3_600_000 }));
      messages.push({
        id: faker.string.uuid(),
        conversationId: conv.id,
        authorId,
        body: faker.lorem.sentences({ min: 1, max: 3 }),
        createdAt: time.toISOString(),
      });
    }

    result[conv.id] = messages;
  }

  return result;
}
