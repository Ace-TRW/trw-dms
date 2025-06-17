import { User, Channel, ChatMessage, PinnedContent } from "./types";
import { FileText, Link as LinkIcon } from "lucide-react"; // Changed Link to LinkIcon

export const APP_USER_ID = "user_app";

export const MOCK_USERS: User[] = [
  {
    _id: APP_USER_ID,
    username: "You",
    avatarUrl: "https://picsum.photos/seed/appuser/100/100",
    status: "online",
  },
  {
    _id: "user_1",
    username: "Alice Wonderland",
    avatarUrl: "https://picsum.photos/seed/alice/100/100",
    status: "online",
    lastSeen: "Online",
  },
  {
    _id: "user_2",
    username: "Bob The Builder",
    avatarUrl: "https://picsum.photos/seed/bob/100/100",
    status: "away",
    lastSeen: "Away",
  },
  {
    _id: "user_3",
    username: "Charlie Brown",
    avatarUrl: "https://picsum.photos/seed/charlie/100/100",
    status: "offline",
    lastSeen: "Last seen 2 hours ago",
  },
  {
    _id: "user_4",
    username: "Diana Prince",
    avatarUrl: "https://picsum.photos/seed/diana/100/100",
    status: "online",
    lastSeen: "Online",
  },
  // Additional users without conversations
  {
    _id: "user_5",
    username: "Emma Wilson",
    avatarUrl: "https://picsum.photos/seed/emma/100/100",
    status: "online",
    lastSeen: "Online",
  },
  {
    _id: "user_6",
    username: "Frank Castle",
    avatarUrl: "https://picsum.photos/seed/frank/100/100",
    status: "away",
    lastSeen: "Away",
  },
  {
    _id: "user_7",
    username: "Grace Hopper",
    avatarUrl: "https://picsum.photos/seed/grace/100/100",
    status: "offline",
    lastSeen: "Last seen 1 hour ago",
  },
  {
    _id: "user_8",
    username: "Henry Ford",
    avatarUrl: "https://picsum.photos/seed/henry/100/100",
    status: "online",
    lastSeen: "Online",
  },
  {
    _id: "user_9",
    username: "Isabella Jones",
    avatarUrl: "https://picsum.photos/seed/isabella/100/100",
    status: "offline",
    lastSeen: "Last seen 3 hours ago",
  },
  {
    _id: "user_10",
    username: "Jack Sparrow",
    avatarUrl: "https://picsum.photos/seed/jack/100/100",
    status: "online",
    lastSeen: "Online",
  },
];

export const MOCK_CHANNELS: Channel[] = [
  {
    _id: "dm_1",
    name: "Alice Wonderland",
    type: "dm",
    recipient_ids: [APP_USER_ID, "user_1"],
    lastMessage: {
      _id: "msg1",
      channelId: "dm_1",
      authorId: "user_1",
      content: "Hey, are you free for a call?",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    unreadCount: 2,
    avatarUrl: MOCK_USERS.find((u) => u._id === "user_1")?.avatarUrl,
  },
  {
    _id: "dm_2",
    name: "Bob The Builder",
    type: "dm",
    recipient_ids: [APP_USER_ID, "user_2"],
    lastMessage: {
      _id: "msg2",
      channelId: "dm_2",
      authorId: APP_USER_ID,
      content: "Sure, let me finish this first.",
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    unreadCount: 0,
    avatarUrl: MOCK_USERS.find((u) => u._id === "user_2")?.avatarUrl,
  },
  {
    _id: "dm_3",
    name: "Charlie Brown",
    type: "dm",
    recipient_ids: [APP_USER_ID, "user_3"],
    lastMessage: {
      _id: "msg3",
      channelId: "dm_3",
      authorId: "user_3",
      content: "Good grief!",
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    unreadCount: 0,
    avatarUrl: MOCK_USERS.find((u) => u._id === "user_3")?.avatarUrl,
  },
  {
    _id: "dm_4",
    name: "Diana Prince",
    type: "dm",
    recipient_ids: [APP_USER_ID, "user_4"],
    lastMessage: {
      _id: "msg4",
      channelId: "dm_4",
      authorId: "user_4",
      content: "Wondering about the project timeline.",
      timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    },
    unreadCount: 1,
    avatarUrl: MOCK_USERS.find((u) => u._id === "user_4")?.avatarUrl,
  },
];

export const MOCK_MESSAGES: { [channelId: string]: ChatMessage[] } = {
  dm_1: [
    {
      _id: "msg1_1",
      channelId: "dm_1",
      authorId: "user_1",
      content: "Hey, are you free for a call?",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
      _id: "msg1_2",
      channelId: "dm_1",
      authorId: APP_USER_ID,
      content: "Hi Alice! Maybe later? I'm a bit busy.",
      timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
    },
    {
      _id: "msg1_3",
      channelId: "dm_1",
      authorId: "user_1",
      content: "No worries! Ping me when you are.",
      timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    },
  ],
  dm_2: [
    {
      _id: "msg2_1",
      channelId: "dm_2",
      authorId: APP_USER_ID,
      content: "Sure, let me finish this first.",
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
      _id: "msg2_2",
      channelId: "dm_2",
      authorId: "user_2",
      content: "Okay, take your time.",
      timestamp: new Date(Date.now() - 9 * 60000).toISOString(),
    },
  ],
  dm_3: [
    {
      _id: "msg3_1",
      channelId: "dm_3",
      authorId: "user_3",
      content: "Good grief!",
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    {
      _id: "msg3_2",
      channelId: "dm_3",
      authorId: APP_USER_ID,
      content: "What happened, Charlie?",
      timestamp: new Date(Date.now() - 59 * 60000).toISOString(),
    },
  ],
  dm_4: [
    {
      _id: "msg4_1",
      channelId: "dm_4",
      authorId: "user_4",
      content: "Wondering about the project timeline.",
      timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    },
  ],
};

export const MOCK_SHARED_MEDIA_IMAGES = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `media_img_${i}`,
    type: "image" as const,
    url: `https://picsum.photos/seed/media${i}/300/300`,
    thumbnailUrl: `https://picsum.photos/seed/media${i}/100/100`,
  }));

export const MOCK_SHARED_FILES = [
  {
    id: "file_1",
    name: "design_spec_v4.pdf",
    size: "3.5 MB",
    url: "#",
    typeIcon: FileText,
  },
  {
    id: "file_2",
    name: "project_plan_final.docx",
    size: "120 KB",
    url: "#",
    typeIcon: FileText,
  },
  {
    id: "file_3",
    name: "meeting_notes.txt",
    size: "15 KB",
    url: "#",
    typeIcon: FileText,
  },
];

export const MOCK_SHARED_LINKS = [
  {
    id: "link_1",
    url: "https://react.dev",
    title: "React Documentation",
    faviconUrl: "https://react.dev/favicon.ico",
    typeIcon: LinkIcon,
  },
  {
    id: "link_2",
    url: "https://tailwindcss.com",
    title: "Tailwind CSS - Rapidly build modern websites",
    faviconUrl: "https://tailwindcss.com/favicons/favicon.ico",
    typeIcon: LinkIcon,
  },
];

export const MOCK_PINNED_MESSAGES: PinnedContent[] = [
  {
    id: "pin-1",
    text: "Remember to check out the new design mockups in Figma.",
  },
  {
    id: "pin-2",
    text: "Project deadline is next Friday, November 10th.",
  },
  {
    id: "pin-3",
    text: "Join the new #design-critique channel for feedback sessions.",
  },
];
