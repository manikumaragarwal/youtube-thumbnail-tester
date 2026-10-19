'use client';

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Mic,
  Sun,
  Moon,
  Eye,
  SlidersHorizontal,
  Smartphone,
  LayoutGrid,
  Columns,
  Search as SearchIcon,
  PlaySquare,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ViewMode, VisualTestSettings } from '@/types';

interface HeaderProps {
  settings: VisualTestSettings;
  onUpdateSettings: (updater: (prev: VisualTestSettings) => VisualTestSettings) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onSearch: (query: string) => void;
  onToggleControlDrawer: () => void;
  isControlDrawerOpen: boolean;
  onStartBlindTest: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  viewMode,
  onChangeViewMode,
  onSearch,
  onToggleControlDrawer,
  isControlDrawerOpen,
  onStartBlindTest,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const isDark = settings.theme === 'dark';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      if (viewMode !== 'search') {
        onChangeViewMode('search');
      }
    }
  };

  const toggleTheme = () => {
    onUpdateSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors border-b backdrop-blur-md ${
        isDark
          ? 'bg-[#0f0f0f]/90 border-neutral-800/80 text-white'
          : 'bg-white/90 border-gray-200 text-[#0f0f0f]'
      }`}
    >
      {/* Main Clean Navigation Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 gap-3 sm:gap-6">
        {/* Left: YouTube Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            title="Toggle Controls Drawer"
            onClick={onToggleControlDrawer}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-gray-100 text-neutral-700'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onChangeViewMode('home')}
            className="flex items-center gap-1.5 cursor-pointer select-none"
          >
            <div className="flex items-center justify-center w-7 h-5 sm:w-8 sm:h-5.5 bg-[#ff0000] rounded-md shadow-sm">
              <div className="w-0 h-0 border-y-[3.5px] border-y-transparent border-l-[7px] border-l-white ml-0.5" />
            </div>
            <span className="font-bold tracking-tight text-lg font-sans">
              YouTube
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider ml-1">
              Tester
            </span>
          </div>
        </div>

        {/* Center: Search Bar (Authentic YouTube Style) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-xl mx-2"
        >
          <div className="flex items-center flex-1 w-full">
            <div
              className={`flex items-center flex-1 h-9 px-4 rounded-l-full border focus-within:border-blue-500 transition-colors ${
                isDark
                  ? 'bg-neutral-900 border-neutral-700 text-white'
                  : 'bg-white border-gray-300 text-black'
              }`}
            >
              <input
                type="text"
                placeholder="Search competitors on YouTube (e.g., tech, podcast, mrbeast)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-xs sm:text-sm placeholder:text-neutral-500"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="text-xs text-neutral-400 hover:text-neutral-200 px-1"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              title="Search"
              className={`flex items-center justify-center w-12 h-9 rounded-r-full border border-l-0 transition-colors ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-300'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-neutral-700'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            title="Search with voice"
            className={`p-2 ml-2 rounded-full transition-colors flex-shrink-0 ${
              isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
        </form>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Main Creator Drawer Button */}
          <button
            onClick={onToggleControlDrawer}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
              isControlDrawerOpen
                ? 'bg-amber-500 text-black ring-2 ring-amber-400/30'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:brightness-105'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize Video</span>
          </button>

          {/* Blind Pop Test Game Button */}
          <button
            onClick={onStartBlindTest}
            title="Blind reaction test: Measures how fast your thumbnail catches attention!"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Pop Test</span>
          </button>

          {/* Dark/Light Switch */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-gray-100 text-neutral-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* User profile avatar */}
          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 ml-1">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="You"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Sub-Header: Segmented View Controller & Visual Testing Tools */}
      <div
        className={`flex items-center justify-between px-4 sm:px-6 py-2 border-t overflow-x-auto no-scrollbar gap-4 ${
          isDark ? 'border-neutral-800/80 bg-neutral-950/40' : 'border-gray-200 bg-gray-50/70'
        }`}
      >
        {/* Recommendation Views - Clean Segmented Pill Group */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-neutral-800/40 border border-neutral-700/50">
          <button
            onClick={() => onChangeViewMode('home')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'home'
                ? isDark
                  ? 'bg-neutral-700 text-white shadow'
                  : 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Home Grid</span>
          </button>

          <button
            onClick={() => onChangeViewMode('sidebar')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'sidebar'
                ? isDark
                  ? 'bg-neutral-700 text-white shadow'
                  : 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Watch Next (Sidebar)</span>
          </button>

          <button
            onClick={() => onChangeViewMode('search')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'search'
                ? isDark
                  ? 'bg-neutral-700 text-white shadow'
                  : 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <SearchIcon className="w-3.5 h-3.5" />
            <span>Search Feed</span>
          </button>

          <button
            onClick={() => onChangeViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'mobile'
                ? isDark
                  ? 'bg-neutral-700 text-white shadow'
                  : 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App</span>
          </button>

          <button
            onClick={() => onChangeViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'split'
                ? isDark
                  ? 'bg-neutral-700 text-white shadow'
                  : 'bg-white text-black shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <PlaySquare className="w-3.5 h-3.5" />
            <span>A/B Split</span>
          </button>
        </div>

        {/* Testing Tools Strip */}
        <div className="flex items-center gap-2 flex-shrink-0 text-xs">
          {/* Squint / Blur Tool */}
          <div className="flex items-center gap-1.5 bg-neutral-800/40 border border-neutral-700/50 rounded-xl px-2.5 py-1">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] text-neutral-400 font-medium">Squint:</span>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={settings.blurAmount}
              onChange={(e) =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  blurAmount: parseInt(e.target.value),
                }))
              }
              className="w-16 accent-blue-500 cursor-pointer h-1.5"
            />
            <span className="text-[11px] font-mono text-neutral-300 w-4">
              {settings.blurAmount}p
            </span>
          </div>

          {/* B&W Contrast Switch */}
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                grayscale: !prev.grayscale,
              }))
            }
            className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
              settings.grayscale
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-neutral-800/40 hover:bg-neutral-800 text-neutral-300 border-neutral-700/50'
            }`}
            title="Checks black & white luminance contrast"
          >
            B&W Contrast
          </button>

          {/* Danger Zone Overlay Switch */}
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                showDangerZone: !prev.showDangerZone,
              }))
            }
            className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
              settings.showDangerZone
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-neutral-800/40 hover:bg-neutral-800 text-neutral-300 border-neutral-700/50'
            }`}
            title="Shows the YouTube timestamp stamp danger zone in the bottom-right corner"
          >
            Stamp Zone
          </button>
        </div>
      </div>
    </header>
  );
};
