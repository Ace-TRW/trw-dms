
import React, { useEffect, useRef, useState } from 'react';
import { appClient } from '../../state/appClient';
import type { ChatMessage } from '../../types';
import { MessageBubble } from '../MessageBubble';
import { Loader2 } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { messagesVersionAtom } from '../../state/jotaiAtoms';

interface ChatV3Props {
  channelId: string;
  width: number; // For potential layout calculations, not strictly used here
  height: number; // For potential layout calculations, not strictly used here
  topSpace?: number; // Not strictly used here
  onTryAgain?: () => void; // Not strictly used here
}

export const ChatV3: React.FC<ChatV3Props> = ({ channelId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesVersion = useAtomValue(messagesVersionAtom);

  useEffect(() => {
    setLoading(true);
    // Simulate fetching messages
    setTimeout(() => {
      const fetchedMessages = appClient.messages.getForChannel(channelId);
      setMessages(fetchedMessages);
      setLoading(false);
    }, 200); // Short delay to show loading state
  }, [channelId, messagesVersion]); // Added messagesVersion to dependencies

  useEffect(() => {
    if(!loading){ // Only scroll if not loading and messages are present
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-base-100">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }
  
  if (!messages.length) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center h-full p-4 text-center bg-base-100">
            <img src="https://picsum.photos/seed/empty-chat/128/128" alt="Empty Chat" className="rounded-full opacity-50 mb-4" />
            <h3 className="text-lg font-medium text-base-content/80">No messages yet</h3>
            <p className="text-sm text-base-content/60">Be the first to say something!</p>
        </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-base-100 h-full">
      {messages.map((msg, index) => {
        const prevMessage = messages[index-1];
        const showAvatar = !prevMessage || prevMessage.authorId !== msg.authorId || (new Date(msg.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 5 * 60000); // Show avatar if new author or >5 mins gap
        return (
          <MessageBubble key={msg._id} message={msg} showAvatar={showAvatar} />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
