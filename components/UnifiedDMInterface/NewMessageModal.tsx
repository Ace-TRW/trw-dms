import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { UserIcon } from '../UserIcon';
import { appClient } from '../../state/appClient';
import type { User, Channel } from '../../types';
import { MOCK_USERS } from '../../constants';

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
}

export const NewMessageModal: React.FC<NewMessageModalProps> = ({ isOpen, onClose, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Get all friends (excluding the current user)
  const allFriends = useMemo(() => {
    return MOCK_USERS.filter(user => user._id !== appClient.user?._id);
  }, []);

  // Filter friends based on search query
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return allFriends;
    
    const query = searchQuery.toLowerCase();
    return allFriends.filter(friend => 
      friend.username.toLowerCase().includes(query)
    );
  }, [allFriends, searchQuery]);

  const handleSelectUser = (userId: string) => {
    onSelectUser(userId);
    onClose();
    setSearchQuery(''); // Reset search on close
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-background-primary rounded-lg shadow-xl animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-stroke">
            <h2 className="text-lg font-semibold text-content-primary">New Message</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-content-secondary" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-stroke">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends..."
                className="w-full bg-background-tertiary border border-stroke rounded-lg pl-10 pr-4 py-2.5 text-[15px] text-content-primary placeholder-content-secondary focus:outline-none focus:border-accent-primary transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Friends List */}
          <div className="max-h-[400px] overflow-y-auto">
            {filteredFriends.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-content-secondary">No friends found</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredFriends.map((friend) => (
                  <button
                    key={friend._id}
                    onClick={() => handleSelectUser(friend._id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background-tertiary transition-colors"
                  >
                    <UserIcon user={friend} size={40} status />
                    <div className="flex-1 text-left">
                      <p className="text-[15px] font-medium text-content-primary">{friend.username}</p>
                      <p className="text-xs text-content-secondary capitalize">{friend.status || 'offline'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};