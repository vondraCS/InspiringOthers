export const SkillLevel = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
} as const;
export type SkillLevel = (typeof SkillLevel)[keyof typeof SkillLevel];

export interface User {
  id: string;
  fullName: string;
  username: string;
  avatar: string;
  interests: string[];
  location: string;
  goals: string[];
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  body: string;
  coverImage?: string;
  createdAt: string;
  tags: string[];
}

export type PostAuthor = Pick<User, 'id' | 'fullName' | 'username' | 'avatar'>;

export interface PostWithAuthor extends Post {
  author: PostAuthor;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  type: 'dm' | 'group' | 'channel';
  participantIds: string[];
  name: string;
}

export interface InterestGroup {
  id: string;
  name: string;
  topic: string;
  skillLevel: SkillLevel;
  memberIds: string[];
}

export interface LocalEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}
