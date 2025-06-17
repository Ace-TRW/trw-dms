import type React from "react";

export interface User {
  _id: string;
  username: string;
  avatarUrl?: string;
  status?: "online" | "offline" | "away";
  lastSeen?: string | Date;
}

export interface Channel {
  _id: string;
  name: string;
  type: "dm" | "group";
  recipient_ids?: string[]; // For DMs
  member_ids?: string[]; // For groups
  lastMessage?: ChatMessage;
  unreadCount?: number;
  avatarUrl?: string; // For group chats or could be derived for DMs
}

export interface ChatMessage {
  _id: string;
  channelId: string;
  authorId: string;
  content: string;
  timestamp: string | Date;
  author?: User; // Optional: populated for display
}

export interface PinnedContent {
  id: string;
  text: string;
}

// For UserInfoPanel Shared Media
export interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string; // e.g., "2.1 MB"
  url: string;
  typeIcon?: React.ElementType;
}

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  faviconUrl?: string;
}
