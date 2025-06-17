
import React from 'react';
import { ChatInput } from './ChatInput';
import { appClient } from '../../state/appClient';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedConversationIdAtom, messagesVersionAtom } from '../../state/jotaiAtoms';

export const ChatFooter: React.FC = () => {
  const selectedChannelId = useAtomValue(selectedConversationIdAtom);
  const setMessagesVersion = useSetAtom(messagesVersionAtom);

  const handleSendMessage = (content: string) => {
    if (selectedChannelId) {
        appClient.messages.addMessage(selectedChannelId, { content });
        setMessagesVersion(v => v + 1); // Increment version to trigger re-fetch
        // The ChatV3 component will re-fetch messages or ideally this would update a global store
        // For simplicity here, ChatV3 refetches on channelId change, but a more robust solution
        // would involve Jotai atoms for messages or a pub/sub system.
        // To trigger a re-render/refetch in ChatV3, we could update a dummy atom or make messages an atom.
        // For now, this is a simplified example.
        console.log(`Message sent to ${selectedChannelId}: ${content}`);
    }
  };
  
  if (!selectedChannelId) return null;

  return (
    <div className="bg-background-secondary border-t border-stroke">
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};
