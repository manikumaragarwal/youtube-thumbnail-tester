'use client';

import React from 'react';
import {
  Home,
  Flame,
  Tv2,
  Library,
  History,
  PlaySquare,
  Clock,
  ThumbsUp,
  Gamepad2,
  Lightbulb,
  Music2,
  Compass,
} from 'lucide-react';
import { ViewMode } from '@/types';

interface SidebarProps {
  isDark: boolean;
  isCollapsed: boolean;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isDark,
  isCollapsed,
  viewMode,
  onChangeViewMode,
}) => {
  // Collapsed compact sidebar (YouTube slim rail)
  if (isCollapsed) {
    return (
      <aside
        className={`hidden sm:flex flex-col items-center py-3 w-18 flex-shrink-0 border-r transition-colors select-none ${
          isDark ? 'bg-[#0f0f0f] border-[#272727] text-white' : 'bg-white border-gray-200 text-[#0f0f0f]'
        }`}
      >
        <button
          onClick={() => onChangeViewMode('home')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl gap-1 text-[10px] font-medium transition-colors ${
            viewMode === 'home'
              ? isDark
                ? 'bg-white/10 text-white'
                : 'bg-black/10 text-black'
              : isDark
              ? 'hover:bg-[#272727] text-[#aaa]'
              : 'hover:bg-gray-100 text-[#606060]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onChangeViewMode('home')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl gap-1 text-[10px] font-medium transition-colors ${
            isDark ? 'hover:bg-[#272727] text-[#aaa]' : 'hover:bg-gray-100 text-[#606060]'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span>Shorts</span>
        </button>

        <button
          onClick={() => onChangeViewMode('home')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl gap-1 text-[10px] font-medium transition-colors ${
            isDark ? 'hover:bg-[#272727] text-[#aaa]' : 'hover:bg-gray-100 text-[#606060]'
          }`}
        >
          <Tv2 className="w-5 h-5" />
          <span>Subs</span>
        </button>

        <button
          onClick={() => onChangeViewMode('sidebar')}
          className={`flex flex-col items-center justify-center w-16 py-3 rounded-xl gap-1 text-[10px] font-medium transition-colors ${
            viewMode === 'sidebar'
              ? isDark
                ? 'bg-white/10 text-white'
                : 'bg-black/10 text-black'
              : isDark
              ? 'hover:bg-[#272727] text-[#aaa]'
              : 'hover:bg-gray-100 text-[#606060]'
          }`}
        >
          <Library className="w-5 h-5" />
          <span>Watch</span>
        </button>
      </aside>
    );
  }

  // Expanded standard YouTube navigation drawer
  return (
    <aside
      className={`hidden lg:flex flex-col w-60 flex-shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto px-3 py-2 border-r transition-colors select-none ${
        isDark ? 'bg-[#0f0f0f] border-[#272727] text-white' : 'bg-white border-gray-200 text-[#0f0f0f]'
      }`}
    >
      {/* Primary section */}
      <div className="space-y-0.5 pb-3 border-b border-white/10">
        <button
          onClick={() => onChangeViewMode('home')}
          className={`flex items-center gap-6 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            viewMode === 'home'
              ? isDark
                ? 'bg-[#272727] text-white font-semibold'
                : 'bg-gray-100 text-black font-semibold'
              : isDark
              ? 'hover:bg-[#272727] text-neutral-300'
              : 'hover:bg-gray-100 text-neutral-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onChangeViewMode('home')}
          className={`flex items-center gap-6 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            isDark ? 'hover:bg-[#272727] text-neutral-300' : 'hover:bg-gray-100 text-neutral-800'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span>Shorts</span>
        </button>

        <button
          onClick={() => onChangeViewMode('home')}
          className={`flex items-center gap-6 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            isDark ? 'hover:bg-[#272727] text-neutral-300' : 'hover:bg-gray-100 text-neutral-800'
          }`}
        >
          <Tv2 className="w-5 h-5" />
          <span>Subscriptions</span>
        </button>
      </div>

      {/* Library section */}
      <div className="space-y-0.5 py-3 border-b border-white/10">
        <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          You
        </div>
        <button
          onClick={() => onChangeViewMode('sidebar')}
          className={`flex items-center gap-6 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            viewMode === 'sidebar'
              ? isDark
                ? 'bg-[#272727] text-white font-semibold'
                : 'bg-gray-100 text-black font-semibold'
              : isDark
              ? 'hover:bg-[#272727] text-neutral-300'
              : 'hover:bg-gray-100 text-neutral-800'
          }`}
        >
          <PlaySquare className="w-5 h-5 text-red-500" />
          <span>Watch Next Mock</span>
        </button>

        <div className={`flex items-center gap-6 w-full px-3 py-2 rounded-xl text-sm font-medium opacity-60 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          <History className="w-5 h-5" />
          <span>History</span>
        </div>

        <div className={`flex items-center gap-6 w-full px-3 py-2 rounded-xl text-sm font-medium opacity-60 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          <Clock className="w-5 h-5" />
          <span>Watch Later</span>
        </div>

        <div className={`flex items-center gap-6 w-full px-3 py-2 rounded-xl text-sm font-medium opacity-60 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          <ThumbsUp className="w-5 h-5" />
          <span>Liked videos</span>
        </div>
      </div>

      {/* Subscriptions list mock */}
      <div className="space-y-1 py-3 border-b border-white/10">
        <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Subscriptions
        </div>

        {[
          { name: 'MrBeast', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', active: true },
          { name: 'Marques Brownlee', img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', active: false },
          { name: 'Veritasium', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', active: true },
          { name: 'Fireship', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', active: false },
          { name: 'Kurzgesagt', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', active: false },
        ].map((sub, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-colors ${
              isDark ? 'hover:bg-[#272727] text-neutral-300' : 'hover:bg-gray-100 text-neutral-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <img src={sub.img} alt={sub.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="truncate max-w-[120px] text-xs font-normal">{sub.name}</span>
            </div>
            {sub.active && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
          </div>
        ))}
      </div>

      {/* Explore section */}
      <div className="space-y-0.5 py-3">
        <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Explore
        </div>
        <div className={`flex items-center gap-6 px-3 py-2 rounded-xl text-sm opacity-60 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          <Compass className="w-5 h-5" />
          <span>Trending</span>
        </div>
        <div className={`flex items-center gap-6 px-3 py-2 rounded-xl text-sm opacity-60 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          <Music2 className="w-5 h-5" />
          <span>Music</span>
        </div>
        <div className={`flex items-center gap-6 px-3 py-2 rounded-xl text-sm opacity-60 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          <Gamepad2 className="w-5 h-5" />
          <span>Gaming</span>
        </div>
        <div className={`flex items-center gap-6 px-3 py-2 rounded-xl text-sm opacity-60 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          <Lightbulb className="w-5 h-5" />
          <span>Learning</span>
        </div>
      </div>
    </aside>
  );
};
