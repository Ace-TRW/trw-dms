
import { MOCK_USERS, MOCK_CHANNELS, APP_USER_ID, MOCK_MESSAGES } from '../constants';
import type { User, Channel, ChatMessage } from '../types';

interface AppClient {
  user: User | null;
  users: {
    get: (userId: string) => User | undefined;
    list: () => User[];
  };
  channels: {
    get: (channelId: string) => Channel | undefined;
    list: () => Channel[];
  };
  messages: {
    getForChannel: (channelId: string) => ChatMessage[];
    addMessage: (channelId: string, message: Omit<ChatMessage, '_id' | 'timestamp' | 'authorId' | 'channelId'>) => ChatMessage;
  };
}

// Simple in-memory store
const usersStore = new Map<string, User>(MOCK_USERS.map(user => [user._id, user]));
const channelsStore = new Map<string, Channel>(MOCK_CHANNELS.map(channel => [channel._id, channel]));
const messagesStore = new Map<string, ChatMessage[]>(Object.entries(MOCK_MESSAGES));


export const appClient: AppClient = {
  user: MOCK_USERS.find(u => u._id === APP_USER_ID) || null,
  users: {
    get: (userId: string) => usersStore.get(userId),
    list: () => Array.from(usersStore.values()),
  },
  channels: {
    get: (channelId: string) => {
        const channel = channelsStore.get(channelId);
        if (channel && channel.type === 'dm' && channel.recipient_ids) {
            const otherUserId = channel.recipient_ids.find(id => id !== APP_USER_ID);
            if (otherUserId) {
                const otherUser = usersStore.get(otherUserId);
                if (otherUser) {
                    return { ...channel, name: otherUser.username, avatarUrl: otherUser.avatarUrl };
                }
            }
        }
        return channel;
    },
    list: () => Array.from(channelsStore.values()).map(channel => {
       if (channel.type === 'dm' && channel.recipient_ids) {
            const otherUserId = channel.recipient_ids.find(id => id !== APP_USER_ID);
            if (otherUserId) {
                const otherUser = usersStore.get(otherUserId);
                if (otherUser) {
                    return { ...channel, name: otherUser.username, avatarUrl: otherUser.avatarUrl };
                }
            }
        }
        return channel;
    }),
  },
  messages: {
    getForChannel: (channelId: string) => {
      const messages = messagesStore.get(channelId) || [];
      return messages.map(msg => ({
        ...msg,
        author: usersStore.get(msg.authorId)
      }));
    },
    addMessage: (channelId, messageContent) => {
      const newMessage: ChatMessage = {
        _id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        channelId, 
        authorId: APP_USER_ID, 
        content: messageContent.content,
        timestamp: new Date().toISOString(),
        author: usersStore.get(APP_USER_ID)
      };
      
      const existingMessages = messagesStore.get(channelId) || [];
      existingMessages.push(newMessage);
      messagesStore.set(channelId, existingMessages);

      // Update channel's last message
      const channel = channelsStore.get(channelId);
      if (channel) {
        channel.lastMessage = newMessage;
        channelsStore.set(channelId, channel);
      }
      return newMessage;
    }
  }
};
