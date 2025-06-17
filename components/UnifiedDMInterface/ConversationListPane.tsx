
import React, { useMemo } from "react";
// Removed observer from mobx-react as it's not used directly here if appClient is not a mobx store
import { appClient } from "../../state/appClient";
import type { Channel } from "../../types";
import { ConversationItem, PendingRequestsList, SearchBar, ConversationListHeader, SavedMessagesItem } from "./ConversationListPaneComponents";
import { useAtomValue } from "jotai";
import { conversationSearchQueryAtom } from "../../state/jotaiAtoms";
import { MessageCircle } from "lucide-react";

interface ConversationListPaneProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export const ConversationListPane: React.FC<ConversationListPaneProps> = ({
  selectedConversationId,
  onSelectConversation,
}) => {
  const channels = appClient.channels.list();
  const searchQuery = useAtomValue(conversationSearchQueryAtom);

  const filteredChannels = useMemo(() => {
    if (!searchQuery) {
      return channels;
    }
    return channels.filter((channel) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [channels, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-background-secondary">
      <ConversationListHeader />
      <SearchBar />
      <PendingRequestsList />
      <SavedMessagesItem />
      <div className="flex-1 overflow-y-auto">
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel) => (
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
            <p className="text-content-secondary">{searchQuery ? "No conversations found" : "No conversations yet"}</p>
          </div>
        )}
      </div>
    </div>
  );
};
