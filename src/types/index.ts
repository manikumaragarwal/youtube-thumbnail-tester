export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelAvatarUrl: string;
  viewCount: string;
  publishedTime: string;
  duration: string;
  verified: boolean;
  category: string;
  description?: string;
  isUserMock?: boolean;
  variantId?: string;
  variantName?: string;
}

export interface ThumbnailVariant {
  id: string;
  name: string; // e.g. "Variant A", "Variant B"
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelAvatarUrl: string;
  viewCount: string;
  publishedTime: string;
  duration: string;
  verified: boolean;
}

export type ViewMode = 'home' | 'sidebar' | 'search' | 'mobile' | 'channel' | 'split';

export type CategoryFilter = 
  | 'All' 
  | 'Technology' 
  | 'Gaming' 
  | 'Podcasts' 
  | 'Education' 
  | 'Entertainment' 
  | 'Business' 
  | 'Science' 
  | 'Music';

export interface VisualTestSettings {
  theme: 'dark' | 'light';
  blurAmount: number; // 0 to 12
  grayscale: boolean;
  scale: number; // 0.6 to 1.1
  highlightUserVideo: boolean;
  slotPosition: number; // 0 to 12 (0 is first video)
  showDangerZone: boolean; // Bottom-right timestamp area
  blindMode: boolean;
  blindStartTime: number | null;
  blindFoundTime: number | null;
}
