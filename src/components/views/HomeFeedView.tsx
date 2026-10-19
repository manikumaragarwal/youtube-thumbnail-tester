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
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? isDark
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDark
                ? 'bg-[#272727] text-white hover:bg-[#3f3f3f]'
                : 'bg-gray-100 text-[#0f0f0f] hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main YouTube Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8 pt-2">
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
