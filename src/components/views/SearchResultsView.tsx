'use client';

import React from 'react';
import { YouTubeVideo, VisualTestSettings } from '@/types';
import { VideoCard } from '@/components/VideoCard';
import { SlidersHorizontal } from 'lucide-react';

interface SearchResultsViewProps {
  videos: YouTubeVideo[];
  settings: VisualTestSettings;
  searchQuery: string;
  onUserVideoClick?: () => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  videos,
  settings,
  searchQuery,
  onUserVideoClick,
}) => {
  const isDark = settings.theme === 'dark';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
      {/* Search Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h2 className="text-base sm:text-lg font-bold">
            Results for{' '}
            <span className="text-amber-400">
              &quot;{searchQuery || 'Popular Videos'}&quot;
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Compare how your title & thumbnail look in YouTube Search results
          </p>
        </div>

        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            isDark ? 'bg-[#272727] text-white hover:bg-[#333]' : 'bg-gray-100 text-black hover:bg-gray-200'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Search Result Cards List */}
      <div className="flex flex-col gap-4">
        {videos.map((video) => (
          <VideoCard
            key={`search-${video.id}-${video.isUserMock ? 'user' : 'yt'}`}
            video={video}
            settings={settings}
            layout="search"
            onUserVideoClick={onUserVideoClick}
          />
        ))}
      </div>
    </div>
  );
};
