
import React, { useMemo, useState } from "react";
// Removed observer from mobx-react as it's not used directly here if appClient is not a mobx store
import { appClient } from "../../state/appClient";
import type { Channel, User } from "../../types";
import { ConversationItem, PendingRequestsList, SearchBar, ConversationListHeader, SavedMessagesItem } from "./ConversationListPaneComponents";
import { NewMessageModal } from "./NewMessageModal";
import { useAtomValue } from "jotai";
import { conversationSearchQueryAtom } from "../../state/jotaiAtoms";
import { MessageCircle, UserPlus } from "lucide-react";
import { MOCK_USERS } from "../../constants";
import { UserIcon } from "../UserIcon";

interface ConversationListPaneProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export const ConversationListPane: React.FC<ConversationListPaneProps> = ({
  selectedConversationId,
  onSelectConversation,
}) => {
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const channels = appClient.channels.list();
  const searchQuery = useAtomValue(conversationSearchQueryAtom);

  // Get all friends who don't have conversations
  const friendsWithoutConversations = useMemo(() => {
    const channelUserIds = new Set(
      channels.flatMap(channel => channel.recipient_ids || [])
    );
    return MOCK_USERS.filter(user => 
      user._id !== appClient.user?._id && !channelUserIds.has(user._id)
    );
  }, [channels]);

  // Enhanced search that includes both conversations and potential new chats
  const searchResults = useMemo(() => {
    if (!searchQuery) {
      return { conversations: channels, potentialChats: [] };
    }

    const query = searchQuery.toLowerCase();
    
    // Search existing conversations
    const conversations = channels.filter((channel) =>
      channel.name.toLowerCase().includes(query)
    );

    // Search friends without conversations
    const potentialChats = friendsWithoutConversations.filter(friend =>
      friend.username.toLowerCase().includes(query)
    );

    return { conversations, potentialChats };
  }, [channels, friendsWithoutConversations, searchQuery]);

  const handleSelectUser = (userId: string) => {
    // Find existing conversation or create new one
    const existingChannel = channels.find(channel => 
      channel.type === 'dm' && channel.recipient_ids?.includes(userId)
    );

    if (existingChannel) {
      onSelectConversation(existingChannel._id);
    } else {
      // In real app, would create a new conversation here
      // For now, just select a mock conversation
      onSelectConversation(`dm_new_${userId}`);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-background-secondary">
        <ConversationListHeader onNewMessage={() => setShowNewMessageModal(true)} />
        <SearchBar />
        <PendingRequestsList />
        <SavedMessagesItem />
        <div className="flex-1 overflow-y-auto">
          {searchQuery ? (
            // Show categorized search results
            <>
              {searchResults.conversations.length > 0 && (
                <>
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold uppercase text-content-tertiary">Conversations</p>
                  </div>
                  {searchResults.conversations.map((channel) => (
                    <ConversationItem
                      key={channel._id}
                      channel={channel}
                      isSelected={selectedConversationId === channel._id}
                      onClick={() => onSelectConversation(channel._id)}
                    />
                  ))}
                </>
              )}
              
              {searchResults.potentialChats.length > 0 && (
                <>
                  <div className="px-4 py-2 mt-2">
                    <p className="text-xs font-semibold uppercase text-content-tertiary">Start New Chat</p>
                  </div>
                  {searchResults.potentialChats.map((friend) => (
                    <button
                      key={friend._id}
                      onClick={() => handleSelectUser(friend._id)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-background-tertiary transition-colors"
                    >
                      <UserIcon user={friend} size={40} status />
                      <div className="flex-1 text-left">
                        <p className="text-[15px] font-medium text-content-primary">{friend.username}</p>
                        <p className="text-xs text-content-secondary">Click to start chatting</p>
                      </div>
                      <UserPlus size={18} className="text-content-tertiary" />
                    </button>
                  ))}
                </>
              )}

              {searchResults.conversations.length === 0 && searchResults.potentialChats.length === 0 && (
                <div className="text-center py-10">
                  <MessageCircle size={48} strokeWidth={1} className="mx-auto mb-4 text-content-tertiary" />
                  <p className="text-content-secondary">No results found</p>
                </div>
              )}
            </>
          ) : (
            // Show all conversations when not searching
            searchResults.conversations.length > 0 ? (
              searchResults.conversations.map((channel) => (
                <ConversationItem
                  key={channel._id}
                  channel={channel}
                  isSelected={selectedConversationId === channel._id}
                  onClick={() => onSelectConversation(channel._id)}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <MessageCircle size={48} strokeWidth={1} className="mx-auto mb-4 text-content-tertiary" />
                <p className="text-content-secondary">No conversations yet</p>
                <p className="text-xs text-content-tertiary mt-2">Click the new message button to start chatting</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* New Message Modal */}
      <NewMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onSelectUser={handleSelectUser}
      />
    </>
  );
};
