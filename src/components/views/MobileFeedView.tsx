'use client';

import React from 'react';
import { YouTubeVideo, VisualTestSettings } from '@/types';
import { VideoCard } from '@/components/VideoCard';
import {
  Cast,
  Bell,
  Search,
  Home,
  Flame,
  PlusCircle,
  Tv2,
  Wifi,
  Battery,
} from 'lucide-react';

interface MobileFeedViewProps {
  videos: YouTubeVideo[];
  settings: VisualTestSettings;
  onUserVideoClick?: () => void;
}

export const MobileFeedView: React.FC<MobileFeedViewProps> = ({
  videos,
  settings,
  onUserVideoClick,
}) => {
  const isDark = settings.theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Mobile Frame Container */}
      <div className="text-center mb-4">
        <h3 className="text-base font-bold text-amber-400">
          Mobile App View (iPhone 15 Simulator)
        </h3>
        <p className="text-xs text-neutral-400">
          70%+ of YouTube clicks occur on mobile. Test if your title gets truncated or thumbnail text becomes unreadable.
        </p>
      </div>

      {/* Realistic Phone Bezel */}
      <div className="relative w-full max-w-[400px] h-[780px] rounded-[48px] p-3 bg-neutral-800 shadow-2xl ring-4 ring-neutral-700 overflow-hidden flex flex-col">
        {/* Phone Dynamic Island / Camera Notch */}
        <div className="absolute top-4 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="w-28 h-6 bg-black rounded-full shadow-inner flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-800" />
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div
          className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col relative transition-colors ${
            isDark ? 'bg-[#0f0f0f] text-white' : 'bg-white text-black'
          }`}
        >
          {/* iOS Status Bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold select-none z-40">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* YouTube Mobile App Top Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 z-40">
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 bg-red-600 rounded flex items-center justify-center">
                <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[6px] border-l-white ml-0.5" />
              </div>
              <span className="font-bold text-sm tracking-tighter">YouTube</span>
            </div>

            <div className="flex items-center gap-3">
              <Cast className="w-4 h-4 text-neutral-400" />
              <Bell className="w-4 h-4 text-neutral-400" />
              <Search className="w-4 h-4 text-neutral-400" />
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* YouTube Mobile Scrolling Feed */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
            {videos.map((video) => (
              <VideoCard
                key={`mobile-${video.id}-${video.isUserMock ? 'user' : 'yt'}`}
                video={video}
                settings={settings}
                layout="mobile"
                onUserVideoClick={onUserVideoClick}
              />
            ))}
          </div>

          {/* YouTube Mobile Bottom Navigation Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 h-14 border-t flex items-center justify-around px-2 z-40 backdrop-blur-md ${
              isDark ? 'bg-[#0f0f0f]/95 border-neutral-800 text-neutral-400' : 'bg-white/95 border-gray-200 text-neutral-600'
            }`}
          >
            <div className="flex flex-col items-center gap-0.5 text-white">
              <Home className="w-5 h-5 text-red-500" />
              <span className="text-[9px]">Home</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Flame className="w-5 h-5" />
              <span className="text-[9px]">Shorts</span>
            </div>
            <div className="flex flex-col items-center">
              <PlusCircle className="w-8 h-8 text-neutral-200" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Tv2 className="w-5 h-5" />
              <span className="text-[9px]">Subs</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-5 h-5 rounded-full overflow-hidden border border-neutral-400">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[9px]">You</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
