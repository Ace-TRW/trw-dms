
import { atom } from "jotai";

export const selectedConversationIdAtom = atom<string | null>(null);
export const showUserPanelAtom = atom(false);
export const conversationSearchQueryAtom = atom("");
export const messagesVersionAtom = atom(0); // Atom to track message updates
export const showNotificationFeedAtom = atom(true); // Default to showing notification feed
export const pinnedUserInfoPanelAtom = atom(false); // Track if user info panel is pinned
export const notificationFeedCollapsedAtom = atom(() => {
  // Persist collapse state in localStorage
  const saved = localStorage.getItem('notificationFeedCollapsed');
  return saved === 'true';
});
