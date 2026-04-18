import { faker } from '@faker-js/faker';
import { generateUsers } from './users';
import { generatePosts } from './posts';
import { generateConversations, generateMessages } from './conversations';
import { generateInterestGroups } from './groups';
import { generateLocalEvents } from './events';

faker.seed(42);

export const USERS = generateUsers(50);
export const POSTS = generatePosts(60, USERS.map((u) => u.id));
export const CONVERSATIONS = generateConversations(USERS);
export const MESSAGES = generateMessages(CONVERSATIONS, USERS);
export const GROUPS = generateInterestGroups(USERS.map((u) => u.id));
export const LOCAL_EVENTS = generateLocalEvents(8);

export const CURRENT_USER_ID = USERS[0].id;
