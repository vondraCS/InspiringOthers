import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { USERS, POSTS, CONVERSATIONS, MESSAGES, GROUPS, LOCAL_EVENTS, CURRENT_USER_ID } from './data/index';
import { type ChatMessage, type Post, type PostWithAuthor } from '@/types';

const USERS_BY_ID = Object.fromEntries(USERS.map((u) => [u.id, u]));

function enrichPost(post: Post): PostWithAuthor {
  const u = USERS_BY_ID[post.authorId];
  return {
    ...post,
    author: { id: u.id, name: u.name, avatar: u.avatar },
  };
}

function enrichPosts(posts: Post[]): PostWithAuthor[] {
  return posts.map(enrichPost);
}

const RECOMMENDED_COUNT = 12;
const NEARBY_COUNT = 12;

const currentUser = USERS.find((u) => u.id === CURRENT_USER_ID)!;
const otherUsers = USERS.filter((u) => u.id !== CURRENT_USER_ID);

const recommendedUsers = otherUsers
  .filter((u) => u.skillLevel === currentUser.skillLevel)
  .slice(0, RECOMMENDED_COUNT);

const nearbyUsers = otherUsers
  .filter((u) => u.id !== currentUser.id && !recommendedUsers.includes(u))
  .slice(0, NEARBY_COUNT);

export const handlers = [
  http.get('/api/auth/me', () => {
    return HttpResponse.json(currentUser);
  }),

  http.get('/api/users/recommended', () => {
    return HttpResponse.json(recommendedUsers);
  }),

  http.get('/api/users/nearby', () => {
    return HttpResponse.json(nearbyUsers);
  }),

  http.get('/api/posts/feed', () => {
    return HttpResponse.json(enrichPosts(POSTS.slice(0, 20)));
  }),

  http.get('/api/posts/recommended', () => {
    return HttpResponse.json(enrichPosts(POSTS.slice(20, 30)));
  }),

  http.get('/api/posts/for-you', () => {
    return HttpResponse.json(enrichPosts(POSTS.slice(30, 50)));
  }),

  http.get('/api/posts/:id', ({ params }) => {
    const post = POSTS.find((p) => p.id === params.id);
    if (!post) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(enrichPost(post));
  }),

  http.get('/api/conversations', () => {
    return HttpResponse.json(CONVERSATIONS);
  }),

  http.get('/api/conversations/:id/messages', ({ params }) => {
    const messages = MESSAGES[params.id as string] ?? [];
    return HttpResponse.json(messages);
  }),

  http.post('/api/conversations/:id/messages', async ({ request, params }) => {
    const { body } = (await request.json()) as { body: string };
    const message: ChatMessage = {
      id: faker.string.uuid(),
      conversationId: params.id as string,
      authorId: CURRENT_USER_ID,
      body,
      createdAt: new Date().toISOString(),
    };
    const existing = MESSAGES[params.id as string];
    if (existing) existing.push(message);
    return HttpResponse.json(message, { status: 201 });
  }),

  http.get('/api/groups', () => {
    return HttpResponse.json(GROUPS);
  }),

  http.get('/api/events/local', () => {
    return HttpResponse.json(LOCAL_EVENTS);
  }),
];
