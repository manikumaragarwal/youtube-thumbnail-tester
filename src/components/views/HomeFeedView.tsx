'use client';

import React from 'react';
import { YouTubeVideo, VisualTestSettings, CategoryFilter } from '@/types';
import { VideoCard } from '@/components/VideoCard';

interface HomeFeedViewProps {
  videos: YouTubeVideo[];
  settings: VisualTestSettings;
  categories: CategoryFilter[];
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  onUserVideoClick?: () => void;
}

export const HomeFeedView: React.FC<HomeFeedViewProps> = ({
  videos,
  settings,
  categories,
  activeCategory,
  onSelectCategory,
  onUserVideoClick,
}) => {
  const isDark = settings.theme === 'dark';

  return (
    <div className="flex-1 w-full px-4 sm:px-6 py-3">
      {/* Category Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? isDark
                  ? 'bg-white text-black shadow'
                  : 'bg-black text-white shadow'
                : isDark
                ? 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                : 'bg-gray-100 text-neutral-800 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main YouTube Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-7 pt-1">
        {videos.map((video) => (
          <VideoCard
            key={`${video.id}-${video.isUserMock ? 'user' : 'yt'}`}
            video={video}
            settings={settings}
            layout="grid"
            onUserVideoClick={onUserVideoClick}
          />
        ))}
      </div>
    </div>
  );
};
