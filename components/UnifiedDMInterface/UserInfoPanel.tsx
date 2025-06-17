import React, { useState, useEffect } from "react";
// Removed observer from mobx-react as it's not strictly needed if user/channel are just props
import {
  X,
  Image,
  FileText,
  Link as LinkIcon,
  Pin,
} from "lucide-react"; // Renamed Link to LinkIcon
import { twMerge } from "tailwind-merge";
import { Username } from "../Username";
import { UserIcon } from "../UserIcon";
import type {
  Channel,
  User,
  FileItem as FileItemType,
  LinkItem as LinkItemType,
} from "../../types";
import {
  MOCK_SHARED_MEDIA_IMAGES,
  MOCK_SHARED_FILES,
  MOCK_SHARED_LINKS,
} from "../../constants";

interface UserInfoPanelProps {
  user: User;
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
  isPinned?: boolean;
  onPinToggle?: () => void;
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  id: string;
  ariaControls: string;
}
const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onClick,
  id,
  ariaControls,
}) => (
  <button
    role="tab"
    id={id}
    aria-controls={ariaControls}
    aria-selected={isActive}
    onClick={onClick}
    className={twMerge(
      "flex-1 py-3 text-xs font-normal uppercase transition-all duration-200 border-b-2",
      isActive
        ? "text-content-primary border-accent-primary"
        : "text-content-secondary border-transparent hover:text-content-primary"
    )}
  >
    {label}
  </button>
);

const FileItemComponent: React.FC<FileItemType> = ({
  name,
  size,
  typeIcon,
}) => (
  <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-background-secondary cursor-pointer transition-colors mb-2">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background-tertiary">
      {typeIcon ? (
        React.createElement(typeIcon, {
          size: 20,
          className: "text-content-secondary",
        })
      ) : (
        <FileText size={20} className="text-content-secondary" />
      )}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate font-normal text-[15px] text-content-primary">
        {name}
      </p>
      <p className="text-xs font-normal text-content-secondary">{size}</p>
    </div>
  </div>
);

const LinkItemComponent: React.FC<LinkItemType> = ({
  url,
  title,
  faviconUrl,
}) => (
  <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-background-secondary cursor-pointer transition-colors mb-2">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background-tertiary">
      {faviconUrl ? (
        <img src={faviconUrl} alt="favicon" className="h-5 w-5" />
      ) : (
        <LinkIcon size={20} className="text-content-secondary" />
      )}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate font-normal text-[15px] text-content-primary">
        {title}
      </p>
      <p className="truncate text-xs font-normal text-content-secondary">
        {url}
      </p>
    </div>
  </div>
);

const ImagesTab: React.FC = () => {
  const images = MOCK_SHARED_MEDIA_IMAGES(9);

  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <Image
          size={48}
          strokeWidth={1}
          className="mx-auto mb-3 text-content-tertiary"
        />
        <p className="text-sm text-content-secondary">No images shared yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((item) => (
        <div
          key={item.id}
          className="aspect-square rounded-lg bg-background-tertiary bg-cover bg-center cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
          style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
          aria-label={`Shared image ${item.id}`}
        />
      ))}
    </div>
  );
};

const FilesTab: React.FC = () => {
  if (MOCK_SHARED_FILES.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText
          size={48}
          strokeWidth={1}
          className="mx-auto mb-3 text-content-tertiary"
        />
        <p className="text-sm text-content-secondary">No files shared yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {MOCK_SHARED_FILES.map((file) => (
        <FileItemComponent key={file.id} {...file} />
      ))}
    </div>
  );
};

const LinksTab: React.FC = () => {
  if (MOCK_SHARED_LINKS.length === 0) {
    return (
      <div className="text-center py-16">
        <LinkIcon
          size={48}
          strokeWidth={1}
          className="mx-auto mb-3 text-content-tertiary"
        />
        <p className="text-sm text-content-secondary">No links shared yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {MOCK_SHARED_LINKS.map((link) => (
        <LinkItemComponent key={link.id} {...link} />
      ))}
    </div>
  );
};

export const UserInfoPanel: React.FC<UserInfoPanelProps> = ({
  user,
  channel: _channel,
  isOpen,
  onClose,
  isPinned = false,
  onPinToggle,
}) => {
  const [activeTab, setActiveTab] = useState<"images" | "files" | "links">(
    "images"
  );
  const [showPinTooltip, setShowPinTooltip] = useState(false);

  // Show onboarding tooltip on first open
  useEffect(() => {
    if (isOpen && !localStorage.getItem("userInfoPanelPinTooltipShown")) {
      setShowPinTooltip(true);
      localStorage.setItem("userInfoPanelPinTooltipShown", "true");
      setTimeout(() => setShowPinTooltip(false), 5000); // Hide after 5 seconds
    }
  }, [isOpen]);

  const imagesTabId = "tab-images";
  const filesTabId = "tab-files";
  const linksTabId = "tab-links";
  const imagesPanelId = "panel-images";
  const filesPanelId = "panel-files";
  const linksPanelId = "panel-links";

  return (
    <div
      className={twMerge(
        "flex h-full w-full flex-col bg-background-primary shadow-lg",
        "border-l border-stroke"
      )}
      aria-hidden={!isOpen}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-stroke p-4 sticky top-0 bg-background-primary z-10">
        <h3
          className="text-base font-bold text-content-primary"
          id="user-info-panel-title"
        >
          Details
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={onPinToggle}
              className={twMerge(
                "p-2 rounded-lg transition-colors",
                isPinned
                  ? "bg-accent-primary/20 text-accent-primary"
                  : "hover:bg-background-tertiary text-content-secondary"
              )}
              aria-label={isPinned ? "Unpin panel" : "Pin panel"}
            >
              <Pin size={18} className={isPinned ? "fill-current" : ""} />
            </button>
            {showPinTooltip && (
              <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-background-tertiary text-xs text-content-primary rounded-lg shadow-lg border border-stroke animate-fade-in">
                Pin to keep this panel open across conversations.
                <div className="absolute -top-1 right-4 w-2 h-2 bg-background-tertiary border-t border-l border-stroke rotate-45" />
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-background-tertiary transition-colors"
            aria-label="Close details panel"
          >
            <X size={18} className="text-content-secondary" />
          </button>
        </div>
      </div>

      {/* User Info Header */}
      <div className="flex flex-col items-center gap-2 border-b border-stroke py-6 px-4 text-center">
        <UserIcon user={user} size={80} status />
        <Username
          user={user}
          className="text-[15px] font-bold text-content-primary mt-3"
        />
        <p className="text-xs font-normal text-content-secondary">
          {user.status || "Offline"}
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b border-stroke sticky top-[73px] bg-background-primary z-10"
        role="tablist"
        aria-labelledby="user-info-panel-title"
      >
        <TabButton
          id={imagesTabId}
          ariaControls={imagesPanelId}
          label="Images"
          isActive={activeTab === "images"}
          onClick={() => setActiveTab("images")}
        />
        <TabButton
          id={filesTabId}
          ariaControls={filesPanelId}
          label="Files"
          isActive={activeTab === "files"}
          onClick={() => setActiveTab("files")}
        />
        <TabButton
          id={linksTabId}
          ariaControls={linksPanelId}
          label="Links"
          isActive={activeTab === "links"}
          onClick={() => setActiveTab("links")}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "images" && (
          <div
            role="tabpanel"
            id={imagesPanelId}
            aria-labelledby={imagesTabId}
            tabIndex={0}
          >
            <ImagesTab />
          </div>
        )}
        {activeTab === "files" && (
          <div
            role="tabpanel"
            id={filesPanelId}
            aria-labelledby={filesTabId}
            tabIndex={0}
          >
            <FilesTab />
          </div>
        )}
        {activeTab === "links" && (
          <div
            role="tabpanel"
            id={linksPanelId}
            aria-labelledby={linksTabId}
            tabIndex={0}
          >
            <LinksTab />
          </div>
        )}
      </div>
    </div>
  );
};
