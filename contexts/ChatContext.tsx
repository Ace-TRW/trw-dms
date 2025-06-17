
import React, { createContext, useContext, useState } from 'react';

interface ChatContextType {
  containerWidth: number;
  containerHeight: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider: React.FC<{ children: React.ReactNode, containerWidth: number, containerHeight: number }> = ({ children, containerWidth, containerHeight }) => {
  return (
    <ChatContext.Provider value={{ containerWidth, containerHeight }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }
  return context;
};
