
import React from 'react';
import type { ChatMessage } from '../types';
import { APP_USER_ID } from '../constants';
import { UserIcon } from './UserIcon';

interface MessageBubbleProps {
  message: ChatMessage;
  showAvatar: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showAvatar }) => {
  const isCurrentUser = message.authorId === APP_USER_ID;

  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`group flex items-end gap-3 my-1 px-4 py-1 hover:bg-accent-muted rounded-lg transition-colors ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {showAvatar && !isCurrentUser && (
        <UserIcon user={message.author} size={32} className="self-end mb-1" />
      )}
      {!showAvatar && !isCurrentUser && <div style={{width: 32}}></div>} {/* Placeholder for alignment */}
      
      <div 
        className={`max-w-[70%] p-3 rounded-2xl ${
          isCurrentUser 
            ? 'bg-navy-light text-white rounded-br-sm' // Light navy blue for current user
            : 'bg-navy-dark text-content-primary rounded-bl-sm' // Dark navy blue for others
        }`}
      >
        {!isCurrentUser && showAvatar && message.author && (
          <p className="text-xs font-medium mb-1 text-content-secondary">{message.author.username}</p>
        )}
        <p className={`text-[15px] font-normal break-words whitespace-pre-wrap ${isCurrentUser ? 'text-white' : 'text-content-primary'}`}>
          {message.content}
        </p>
        <p className={`text-xs font-normal mt-1 ${isCurrentUser ? 'text-white/80 text-right' : 'text-content-secondary'}`}>
          {time}
        </p>
      </div>
    </div>
  );
};
