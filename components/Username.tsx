
import React from 'react';
import { appClient } from '../state/appClient'; // Assuming appClient can fetch user by ID
import type { User } from '../types';

interface UsernameProps {
  userId?: string;
  user?: User;
  className?: string;
  tag?: keyof JSX.IntrinsicElements; // e.g., 'span', 'div', 'p'
}

export const Username: React.FC<UsernameProps> = ({ userId, user: directUser, className, tag = 'span' }) => {
  const [effectiveUser, setEffectiveUser] = React.useState<User | undefined>(directUser);

  React.useEffect(() => {
    if (directUser) {
      setEffectiveUser(directUser);
    } else if (userId) {
      const fetchedUser = appClient.users.get(userId);
      setEffectiveUser(fetchedUser);
    }
  }, [userId, directUser]);

  const Tag = tag;

  return (
    <Tag className={className}>
      {effectiveUser?.username || 'Unknown User'}
    </Tag>
  );
};
