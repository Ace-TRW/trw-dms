
import React, { useCallback, useState, useEffect } from "react";
import { useAtom } from "jotai";
import type { SetStateAction } from "jotai"; // For explicitly typing atom setters
import { twMerge } from "tailwind-merge";
import { MessageCircle } from "lucide-react";
import { useDesktopView } from "../../hooks/useDevice"; 
import { ConversationListPane } from "./ConversationListPane";
import { ChatPane } from "./ChatPane";
import { NotificationFeed } from "./NotificationFeed";
import { UserInfoPanel } from "./UserInfoPanel";
import { appClient } from "../../state/appClient";
import type { User, Channel } from "../../types";
import { 
  selectedConversationIdAtom, 
  showUserPanelAtom,
  showNotificationFeedAtom,
  pinnedUserInfoPanelAtom,
  notificationFeedCollapsedAtom 
} from "../../state/jotaiAtoms"; 

export const UnifiedDMInterface: React.FC = () => {
  const isDesktopView = useDesktopView(); 
  
  const [selectedConversationId, setSelectedConversationId] = useAtom(selectedConversationIdAtom);
  const [showUserPanel, setShowUserPanel] = useAtom(showUserPanelAtom);
  const [pinnedUserPanel, setPinnedUserPanel] = useAtom(pinnedUserInfoPanelAtom);
  const [notificationFeedCollapsed, setNotificationFeedCollapsed] = useAtom(notificationFeedCollapsedAtom);
  
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(3); // Mock unread count
  const [currentChannel, setCurrentChannel] = useState<Channel | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [previousConversationId, setPreviousConversationId] = useState<string | null>(null);
  
  // Get current channel and user data
  useEffect(() => {
    if (selectedConversationId) {
      const channel = appClient.channels.get(selectedConversationId);
      setCurrentChannel(channel);
      if (channel?.type === 'dm' && channel.recipient_ids) {
        const userId = channel.recipient_ids.find((id) => id !== appClient.user!._id);
        if (userId) {
          setCurrentUser(appClient.users.get(userId));
        }
      }
    }
  }, [selectedConversationId]);
  
  // Handle conversation switch - reset user panel if not pinned
  useEffect(() => {
    if (selectedConversationId !== previousConversationId) {
      if (!pinnedUserPanel && showUserPanel) {
        setShowUserPanel(false);
      }
      setPreviousConversationId(selectedConversationId);
    }
  }, [selectedConversationId, previousConversationId, pinnedUserPanel, showUserPanel, setShowUserPanel]);
  
  const handleSelectConversation = useCallback((conversationId: string): void => {
    setSelectedConversationId(conversationId);
  }, [setSelectedConversationId]);
  
  const handleBack = useCallback((): void => {
    setSelectedConversationId(null);
    setShowUserPanel(false); 
  }, [setSelectedConversationId, setShowUserPanel]);
  
  const handleToggleFeed = useCallback((): void => {
    const newValue = !notificationFeedCollapsed;
    setNotificationFeedCollapsed(newValue);
    localStorage.setItem('notificationFeedCollapsed', String(newValue));
  }, [notificationFeedCollapsed, setNotificationFeedCollapsed]);

  const showMasterPane = isDesktopView || !selectedConversationId;
  const showDetailPane = isDesktopView || selectedConversationId;
  
  // Determine what to show in the third pane
  // Always show the third pane container in desktop view, but control what's inside
  const showThirdPane = isDesktopView;
  
  return (
    <div className="flex h-full bg-background-primary"> 
      <div className="flex flex-1 overflow-hidden">
        {showMasterPane && (
          <div
            className={twMerge(
              "flex flex-col bg-background-secondary", 
              isDesktopView ? "w-[380px] flex-shrink-0 border-r border-stroke" : "w-full"
            )}
          >
            <ConversationListPane
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
            />
          </div>
        )}
        
        {showDetailPane && selectedConversationId ? ( 
          <div className="flex flex-1 flex-col bg-background-secondary relative"> 
              <ChatPane
                conversationId={selectedConversationId}
                isDesktopView={isDesktopView}
                onBack={handleBack}
                showUserPanel={showUserPanel}
                setShowUserPanel={setShowUserPanel}
                notificationFeedCollapsed={notificationFeedCollapsed}
                onToggleFeed={handleToggleFeed}
                notificationUnreadCount={notificationUnreadCount}
              />
          </div>
        ) : isDesktopView && !selectedConversationId ? ( 
            <div className="flex-1 flex flex-col items-center justify-center bg-background-secondary p-8">
                <MessageCircle size={64} strokeWidth={1} className="mx-auto mb-6 text-content-tertiary" />
                <h2 className="text-xl font-semibold mb-2 text-content-primary">Select a conversation</h2>
                <p className="text-sm text-content-secondary text-center">
                    Choose from your existing conversations, start a new one,<br />
                    or search for anything.
                </p>
            </div>
        ) : null}
      </div>
      
      {/* Third Pane - Either Notification Feed or User Info Panel */}
      {showThirdPane && (
        <div className="w-[380px] flex-shrink-0 relative">
          {/* Notification Feed (default) */}
          {!notificationFeedCollapsed && !showUserPanel && (
            <NotificationFeed 
              onClose={() => {
                setNotificationFeedCollapsed(true);
                localStorage.setItem('notificationFeedCollapsed', 'true');
              }} 
              onUnreadCountChange={setNotificationUnreadCount}
            />
          )}
          
          {/* User Info Panel (temporary override when opened) */}
          {showUserPanel && currentUser && currentChannel && (
            <UserInfoPanel
              user={currentUser}
              channel={currentChannel}
              isOpen={showUserPanel}
              onClose={() => setShowUserPanel(false)}
              isPinned={pinnedUserPanel}
              onPinToggle={() => setPinnedUserPanel(!pinnedUserPanel)}
            />
          )}
        </div>
      )}
    </div>
  );
};
