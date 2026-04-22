import { UserCard } from './UserCard';
import { cn } from '@/lib/utils';
import { type User } from '@/types';

type UserListProps = {
  users: User[];
  layout?: 'row' | 'grid';
  className?: string;
};

export function UserList({ users, layout = 'row', className }: UserListProps) {
  if (layout === 'grid') {
    return (
      <div className={cn('grid grid-cols-4 gap-6', className)}>
        {users.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            fullName={user.fullName}
            username={user.username}
            avatar={user.avatar}
            interests={user.interests}
            location={user.location}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-6 flex-wrap', className)}>
      {users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          fullName={user.fullName}
          username={user.username}
          avatar={user.avatar}
          interests={user.interests}
          location={user.location}
        />
      ))}
    </div>
  );
}
