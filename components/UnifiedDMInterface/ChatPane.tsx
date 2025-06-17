
import React, { useRef, useEffect } from "react";
import { twMerge } from 'tailwind-merge'; // Added import for twMerge
import { ChevronLeft, Info, Bell } from "lucide-react";
import { Button } from "react-daisyui";
import { UserIcon } from "../UserIcon";
import { Username } from "../Username";
import { UserStatusText } from "../UserStatusText";
import { appClient } from "../../state/appClient";
import { useOpenDialog } from "../../hooks/useOpenDialog";
import { ChatV3 } from "../ChatV3/ChatV3";
import { ChatFooter } from "../ChatFooter/ChatFooter";
import { useAtom, type SetStateAction } from "jotai"; // Updated Jotai import
import { selectedConversationIdAtom } from "../../state/jotaiAtoms"; 
import { ChatContextProvider } from "../../contexts/ChatContext"; 
import useDimensions from "react-cool-dimensions"; 
import type { User, Channel } from "../../types"; 

interface ChatPaneProps {
  conversationId: string;
  isDesktopView: boolean;
  onBack: () => void;
  showUserPanel: boolean;
  setShowUserPanel: (show: boolean) => void;
  notificationFeedCollapsed?: boolean;
  onToggleFeed?: () => void;
  notificationUnreadCount?: number;
}

export const ChatPane: React.FC<ChatPaneProps> = ({
    conversationId,
    isDesktopView,
    onBack,
    showUserPanel,
    setShowUserPanel,
    notificationFeedCollapsed = false,
    onToggleFeed,
    notificationUnreadCount = 0,
  }) => {
    const openDialog = useOpenDialog();
    // Explicitly type the destructured atom state and setter
    const [, setSelectedChannelIdAtomGlobal]: [
        string | null, // Type for the atom's value (selectedConversationId)
        (update: SetStateAction<string | null>) => void // Type for the setter function
    ] = useAtom(selectedConversationIdAtom); 

    const [channel, setChannel] = React.useState<Channel | undefined>(undefined);
    const [user, setUser] = React.useState<User | undefined>(undefined);
    
    useEffect(() => {
      setSelectedChannelIdAtomGlobal(conversationId);
      const currentChannel = appClient.channels.get(conversationId);
      setChannel(currentChannel);
      if (currentChannel?.type === 'dm' && currentChannel.recipient_ids) {
        const userId = currentChannel.recipient_ids.find((id) => id !== appClient.user!._id);
        if (userId) {
          setUser(appClient.users.get(userId));
        }
      } else {
        setUser(undefined); 
      }
    }, [conversationId, setSelectedChannelIdAtomGlobal]);

    const { observe: chatParentObserveRef, width: chatParentWidth = 0, height: chatParentHeight = 0 } = useDimensions({
      useBorderBoxSize: true,
    });
    const { observe: headerObserveRef, height: actualHeaderHeight = 0 } = useDimensions({
      useBorderBoxSize: true,
    });
    const { observe: footerObserveRef, height: actualFooterHeight = 0 } = useDimensions({
      useBorderBoxSize: true,
    });

    if (!channel || !user) {
      return (
        <div className="flex h-full items-center justify-center bg-background-secondary">
          <p className="text-content-secondary">Loading conversation...</p>
        </div>
      );
    }

    return (
      <ChatContextProvider
        containerWidth={chatParentWidth}
        containerHeight={chatParentHeight}
      >
        <div className="flex h-full">
          <div className="relative flex flex-1 flex-col bg-background-secondary" ref={chatParentObserveRef}>
            {/* Custom Header for DM Interface */}
            <div
              ref={headerObserveRef}
              className="z-20 flex items-center gap-3 border-b border-stroke bg-background-secondary px-4 py-3"
            >
              {!isDesktopView && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
                >
                  <ChevronLeft size={20} className="text-content-secondary" />
                </button>
              )}

              <div
                className="flex flex-1 cursor-pointer items-center gap-3 min-w-0"
                onClick={() =>
                  openDialog({ id: "profile", params: { userId: user._id } })
                }
              >
                <UserIcon user={user} size={36} status />
                <div className="flex-1 min-w-0">
                  <Username user={user} className="text-[15px] font-medium text-content-primary truncate block" />
                  <UserStatusText
                    user={user}
                    className="text-xs font-normal text-content-secondary truncate block"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isDesktopView && onToggleFeed && (
                  <button
                    onClick={onToggleFeed}
                    className={twMerge(
                      "p-2 rounded-lg transition-colors relative",
                      !notificationFeedCollapsed ? "bg-background-tertiary" : "hover:bg-background-tertiary"
                    )}
                  >
                    <Bell size={18} className="text-content-secondary" />
                    {/* Show badge only if there are unread notifications and feed is collapsed */}
                    {notificationUnreadCount > 0 && notificationFeedCollapsed && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => setShowUserPanel(!showUserPanel)}
                  className={twMerge(
                    "p-2 rounded-lg transition-colors",
                    showUserPanel ? "bg-background-tertiary" : "hover:bg-background-tertiary"
                  )}
                >
                  <Info size={18} className="text-content-secondary" />
                </button>
              </div>
            </div>

            <div
              className="absolute"
              style={{
                top: actualHeaderHeight,
                left: 0,
                width: "100%", // chatParentWidth could also be used if needed for consistency
                bottom: actualFooterHeight,
              }}
            >
              <ChatV3
                channelId={conversationId}
                width={chatParentWidth} // Pass parent width
                height={
                  chatParentHeight - actualHeaderHeight - actualFooterHeight 
                }
              />
            </div>
            
            <div
              className="absolute bottom-0 left-0 right-0 z-20"
              ref={footerObserveRef}
            >
              <ChatFooter />
            </div>
          </div>

        </div>
      </ChatContextProvider>
    );
  };
