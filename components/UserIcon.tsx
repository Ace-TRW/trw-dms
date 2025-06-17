
import React from 'react';
import type { User } from '../types';
import { User as UserLucideIcon } from 'lucide-react'; // Default icon

interface UserIconProps {
  userId?: string; // Optional: if provided, could fetch user details
  user?: User; // Optional: direct user object
  avatarUrl?: string; // Optional: direct avatar URL
  size?: number;
  status?: boolean; // Show status indicator
  className?: string;
}

export const UserIcon: React.FC<UserIconProps> = ({ user, avatarUrl, size = 40, status, className }) => {
  const displayUrl = user?.avatarUrl || avatarUrl || `https://picsum.photos/seed/${user?._id || 'default'}/${size}/${size}`;
  
  const statusColor = user?.status === 'online' ? 'bg-status-online' : user?.status === 'away' ? 'bg-yellow-500' : 'bg-content-tertiary';

  // If no avatar, show initials
  const getInitials = () => {
    if (!user?.username) return '?';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <div className={`relative flex-shrink-0 ${className || ''}`} style={{ width: size, height: size }}>
      {displayUrl ? (
        <img src={displayUrl} alt={user?.username || 'User Avatar'} className="rounded-full w-full h-full object-cover" />
      ) : (
        <div className="rounded-full w-full h-full bg-background-tertiary flex items-center justify-center">
          <span className="text-content-primary font-semibold" style={{ fontSize: `${size / 2}px` }}>
            {getInitials()}
          </span>
        </div>
      )}
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full border-2 border-background-secondary ${statusColor}`}
          style={{ width: size / 4, height: size / 4 }}
          title={user?.status || 'offline'}
        />
      )}
    </div>
  );
};
