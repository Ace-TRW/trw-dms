import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { X, AtSign, MessageSquare, Bell, Users, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { UserIcon } from '../UserIcon';

// Notification types
type NotificationType = 'mention' | 'reply' | 'friend_request' | 'system' | 'achievement' | 'alert';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  user?: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  actionUrl?: string;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'mention',
    title: '@alice mentioned you',
    message: 'Hey @you, check out this amazing project we discussed!',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    user: {
      id: 'user_1',
      username: 'Alice Wonderland',
      avatarUrl: 'https://picsum.photos/seed/alice/100/100'
    }
  },
  {
    id: 'notif_2',
    type: 'reply',
    title: 'Bob replied to your message',
    message: 'That sounds great! Let\'s schedule a meeting for tomorrow.',
    timestamp: new Date(Date.now() - 15 * 60000),
    read: false,
    user: {
      id: 'user_2',
      username: 'Bob The Builder',
      avatarUrl: 'https://picsum.photos/seed/bob/100/100'
    }
  },
  {
    id: 'notif_3',
    type: 'friend_request',
    title: 'New friend request',
    message: 'Emma Wilson wants to connect with you',
    timestamp: new Date(Date.now() - 30 * 60000),
    read: true,
    user: {
      id: 'user_5',
      username: 'Emma Wilson',
      avatarUrl: 'https://picsum.photos/seed/emma/100/100'
    }
  },
  {
    id: 'notif_4',
    type: 'system',
    title: 'System Update',
    message: 'New features have been added to improve your experience',
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    read: true
  },
  {
    id: 'notif_5',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You\'ve reached 100 conversations milestone',
    timestamp: new Date(Date.now() - 3 * 60 * 60000),
    read: true
  },
  {
    id: 'notif_6',
    type: 'alert',
    title: 'Security Alert',
    message: 'New login detected from Chrome on Windows',
    timestamp: new Date(Date.now() - 24 * 60 * 60000),
    read: true
  }
];

interface NotificationFeedProps {
  onClose?: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationFeed: React.FC<NotificationFeedProps> = ({ onClose, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'mention':
        return <AtSign size={18} className="text-blue-400" />;
      case 'reply':
        return <MessageSquare size={18} className="text-green-400" />;
      case 'friend_request':
        return <Users size={18} className="text-purple-400" />;
      case 'system':
        return <Info size={18} className="text-gray-400" />;
      case 'achievement':
        return <CheckCircle size={18} className="text-yellow-400" />;
      case 'alert':
        return <AlertCircle size={18} className="text-red-400" />;
    }
  };

  const getNotificationBgColor = (type: NotificationType) => {
    switch (type) {
      case 'mention':
        return 'bg-blue-500/10';
      case 'reply':
        return 'bg-green-500/10';
      case 'friend_request':
        return 'bg-purple-500/10';
      case 'system':
        return 'bg-gray-500/10';
      case 'achievement':
        return 'bg-yellow-500/10';
      case 'alert':
        return 'bg-red-500/10';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Notify parent component of unread count changes
  React.useEffect(() => {
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  return (
    <div className="flex flex-col h-full bg-background-primary border-l border-stroke">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-stroke">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-content-primary" />
          <h2 className="text-lg font-semibold text-content-primary">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
          aria-label="Close notifications"
        >
          <X size={20} className="text-content-secondary" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <Bell size={48} className="text-content-tertiary mb-4" />
            <p className="text-content-secondary text-center">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={twMerge(
                  'mb-2 p-3 rounded-lg cursor-pointer transition-all duration-150',
                  'hover:bg-background-tertiary',
                  !notification.read && 'bg-background-secondary'
                )}
              >
                <div className="flex gap-3">
                  {/* Icon or User Avatar */}
                  {notification.user ? (
                    <UserIcon 
                      avatarUrl={notification.user.avatarUrl} 
                      size={36} 
                      status={false}
                    />
                  ) : (
                    <div className={twMerge(
                      'w-9 h-9 rounded-full flex items-center justify-center',
                      getNotificationBgColor(notification.type)
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={twMerge(
                        'text-sm font-medium',
                        !notification.read ? 'text-content-primary' : 'text-content-secondary'
                      )}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-content-tertiary whitespace-nowrap">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-content-secondary mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with action buttons */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-stroke">
          <button className="w-full py-2 text-sm font-medium text-content-secondary hover:text-content-primary transition-colors">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};