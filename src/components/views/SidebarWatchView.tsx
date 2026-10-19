'use client';

import React from 'react';
import { YouTubeVideo, VisualTestSettings } from '@/types';
import { VideoCard } from '@/components/VideoCard';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Bookmark,
  Play,
  Volume2,
  Maximize2,
  Settings,
  Subtitles,
  MessageSquare,
} from 'lucide-react';

interface SidebarWatchViewProps {
  videos: YouTubeVideo[];
  settings: VisualTestSettings;
  onUserVideoClick?: () => void;
}

export const SidebarWatchView: React.FC<SidebarWatchViewProps> = ({
  videos,
  settings,
  onUserVideoClick,
}) => {
  const isDark = settings.theme === 'dark';

  return (
    <div className="max-w-[1780px] mx-auto px-4 sm:px-6 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Video Player & Engagement (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {/* Cinema Player Mock */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center group">
            <img
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80"
              alt="Currently Playing Video"
              className="w-full h-full object-cover opacity-85"
            />

            {/* Centered Play Button */}
            <div className="absolute w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>

            {/* Bottom Video Controls Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col gap-2">
              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/30 rounded-full cursor-pointer relative group/bar">
                <div className="w-1/3 h-full bg-red-600 rounded-full" />
                <div className="absolute left-1/3 -top-1 w-3 h-3 bg-red-600 rounded-full shadow scale-0 group-hover/bar:scale-100 transition-transform" />
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-4">
                  <Play className="w-4 h-4 fill-white cursor-pointer" />
                  <Volume2 className="w-4 h-4 cursor-pointer" />
                  <span className="font-mono text-[11px]">04:12 / 18:34</span>
                </div>
                <div className="flex items-center gap-3">
                  <Subtitles className="w-4 h-4 cursor-pointer" />
                  <Settings className="w-4 h-4 cursor-pointer" />
                  <Maximize2 className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Video Title */}
          <h1
            className={`text-lg sm:text-xl font-bold leading-snug mt-1 ${
              isDark ? 'text-white' : 'text-[#0f0f0f]'
            }`}
          >
            How Top Creators Optimize Thumbnails To Get 10M+ Views
          </h1>

          {/* Channel Row & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            {/* Channel info */}
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                alt="Creator"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-semibold leading-tight">
                  Studio Insights
                </h4>
                <p className="text-xs text-neutral-400">2.4M subscribers</p>
              </div>
              <button className="ml-2 px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-semibold rounded-full transition-colors shadow">
                Subscribe
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
              <div className={`flex items-center rounded-full overflow-hidden ${isDark ? 'bg-[#272727]' : 'bg-gray-100'}`}>
                <button className={`flex items-center gap-1.5 px-3 py-2 ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200'} transition-colors`}>
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>142K</span>
                </button>
                <div className={`w-[1px] h-5 ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
                <button className={`px-2.5 py-2 ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200'} transition-colors`}>
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <button className={`flex items-center gap-1.5 px-3 py-2 rounded-full ${isDark ? 'bg-[#272727] hover:bg-[#333]' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button className={`flex items-center gap-1.5 px-3 py-2 rounded-full ${isDark ? 'bg-[#272727] hover:bg-[#333]' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button className={`p-2 rounded-full ${isDark ? 'bg-[#272727] hover:bg-[#333]' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description Box */}
          <div
            className={`p-3.5 rounded-xl text-xs leading-relaxed ${
              isDark ? 'bg-[#272727]/70 text-neutral-300' : 'bg-gray-100 text-neutral-700'
            }`}
          >
            <div className="font-semibold text-neutral-200 mb-1">
              892,104 views • Premiered 2 days ago
            </div>
            <p>
              In this video we break down why thumbnails win or lose clicks in the sidebar recommendations! Look at the sidebar on the right to test how your thumbnail performs against other suggested videos.
            </p>
          </div>

          {/* Comments Preview */}
          <div className="pt-2">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-base font-bold">1,842 Comments</span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Sort by
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                alt="You"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 border-b border-neutral-600 pb-1 text-xs text-neutral-400">
                Add a comment...
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Watch Next Sidebar Recommendations (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>Watch Next Recommendations</span>
            </h3>
            <span className="text-[11px] text-neutral-400">
              {videos.length} videos
            </span>
          </div>

          {/* Sidebar Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Related', 'Recently uploaded', 'Watched'].map((chip, idx) => (
              <button
                key={chip}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  idx === 0
                    ? isDark
                      ? 'bg-white text-black'
                      : 'bg-black text-white'
                    : isDark
                    ? 'bg-[#272727] text-white hover:bg-[#333]'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Sidebar Recommended Video List */}
          <div className="flex flex-col gap-3">
            {videos.map((video) => (
              <VideoCard
                key={`sidebar-${video.id}-${video.isUserMock ? 'user' : 'yt'}`}
                video={video}
                settings={settings}
                layout="sidebar"
                onUserVideoClick={onUserVideoClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
