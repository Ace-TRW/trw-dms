
import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { Channel } from '../../types';
import { UserIcon } from '../UserIcon';
import { MoreHorizontal, UserPlus, Search, Bookmark, Ban } from 'lucide-react';
import { Button, Input } from 'react-daisyui';
import { useAtom } from 'jotai';
import { conversationSearchQueryAtom } from '../../state/jotaiAtoms';

interface ConversationItemProps {
  channel: Channel;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ channel, isSelected, onClick }) => {
  const lastMessageText = channel.lastMessage?.content || "No messages yet";
  const lastMessageTime = channel.lastMessage ? formatTimestamp(new Date(channel.lastMessage.timestamp)) : "";

  const baseClasses = "flex w-full items-center gap-3 px-3 py-2 transition-all duration-150 border-l-[3px]";
  const stateClasses = isSelected
    ? "bg-background-tertiary border-accent-primary"
    : "hover:bg-background-tertiary border-transparent";

  return (
    <button
      onClick={onClick}
      className={twMerge(baseClasses, stateClasses)}
    >
      <UserIcon avatarUrl={channel.avatarUrl} size={40} status={false} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[15px] font-medium text-content-primary truncate">{channel.name}</h3>
          <span className="text-xs font-normal text-content-secondary">{lastMessageTime}</span>
        </div>
        <p className="text-[15px] font-normal text-content-secondary truncate">{lastMessageText}</p>
      </div>
      {channel.unreadCount && channel.unreadCount > 0 && (
        <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full min-w-[20px] text-center">
          {channel.unreadCount > 99 ? "99+" : channel.unreadCount}
        </span>
      )}
    </button>
  );
};

// Helper function for timestamp formatting
const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
};

// Placeholder for Pending Requests List
// Mock data for friend requests
const mockFriendRequests = [
  { id: "req1", userId: "user_5", username: "Emma Wilson", message: "Hey! Would love to connect", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "req2", userId: "user_6", username: "David Chen", message: "We met at the conference last week", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) }
];

export const PendingRequestsList: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [requests, setRequests] = React.useState(mockFriendRequests);
  
  if (requests.length === 0) return null;

  const handleAccept = (requestId: string) => {
    setRequests(requests.filter(req => req.id !== requestId));
    // In real app, would make API call to accept request
  };

  const handleDecline = (requestId: string) => {
    setRequests(requests.filter(req => req.id !== requestId));
    // In real app, would make API call to decline request
  };

  return (
    <>
      <div 
        className="mx-3 my-2 p-3 rounded-lg bg-accent-muted border border-accent-primary/30 hover:bg-accent-primary/20 cursor-pointer transition-all duration-150"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
            <UserPlus size={20} className="text-accent-primary" />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-medium text-content-primary">Friend Requests</div>
            <div className="text-xs font-normal text-content-secondary">
              {requests.length} pending request{requests.length !== 1 ? "s" : ""}
            </div>
          </div>
          <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full min-w-[20px] text-center">
            {requests.length}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mx-3 mb-2 rounded-lg bg-background-tertiary/50 p-2">
          {requests.map((request) => (
            <div key={request.id} className="p-3 mb-2 last:mb-0 rounded-lg hover:bg-background-tertiary transition-colors">
              <div className="flex items-start gap-3">
                <UserIcon avatarUrl={`https://picsum.photos/seed/${request.userId}/100/100`} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-content-primary">{request.username}</p>
                  <p className="text-xs text-content-secondary mt-0.5">{request.message}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAccept(request.id); }}
                      className="px-3 py-1 text-xs font-medium bg-accent-primary hover:bg-accent-primary/80 text-white rounded-md transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDecline(request.id); }}
                      className="px-3 py-1 text-xs font-medium bg-background-tertiary hover:bg-background-secondary text-content-primary rounded-md transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};


export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useAtom(conversationSearchQueryAtom);
  return (
    <div className="px-4 pb-4">
      <div className="relative flex items-center">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-content-secondary" />
        </span>
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-background-primary border border-stroke rounded-lg pl-10 pr-4 py-2.5 text-sm text-content-primary placeholder-content-secondary focus:outline-none focus:border-accent-primary transition-colors"
        />
      </div>
    </div>
  );
};

export const SavedMessagesItem: React.FC = () => {
  return (
    <div className="mx-3 my-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 cursor-pointer transition-all duration-150">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Bookmark size={20} className="text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="text-[15px] font-medium text-content-primary">Saved Messages</div>
          <div className="text-xs font-normal text-content-secondary">
            Your personal space
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConversationListHeader: React.FC = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  
  return (
    <div className="p-4 border-b border-stroke flex items-center justify-between">
      <h1 className="text-xl font-bold text-content-primary">Messages</h1>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
        >
          <MoreHorizontal size={20} className="text-content-secondary" />
        </button>
        
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-background-primary border border-stroke shadow-lg z-50">
              <button
                className="w-full px-4 py-3 text-left text-sm font-normal text-content-primary hover:bg-background-tertiary transition-colors flex items-center gap-3"
                onClick={() => {
                  setShowMenu(false);
                  // Handle blocked users action
                }}
              >
                <Ban size={16} className="text-content-secondary" />
                Blocked Users
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
