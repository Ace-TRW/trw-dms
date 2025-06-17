
import React from 'react';
import type { User } from '../types';

interface UserStatusTextProps {
  user?: User;
  className?: string;
}

export const UserStatusText: React.FC<UserStatusTextProps> = ({ user, className }) => {
  if (!user) {
    return <span className={className}></span>;
  }

  let statusText = "Offline";
  if (user.status === "online") {
    statusText = "Online";
  } else if (user.status === "away") {
    statusText = "Away";
  } else if (user.lastSeen) {
     if (typeof user.lastSeen === 'string') {
        statusText = user.lastSeen; // If it's already a formatted string like "Last seen 2 hours ago"
     } else {
        // Basic date formatting, consider a library for more complex needs
        statusText = `Last seen: ${new Date(user.lastSeen).toLocaleTimeString()}`;
     }
  }

  return (
    <span className={className}>
      {statusText}
    </span>
  );
};
