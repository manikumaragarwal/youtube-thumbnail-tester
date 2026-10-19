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
      className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b ${
        isDark
          ? 'bg-[#0f0f0f]/95 border-[#272727] text-white backdrop-blur-md'
          : 'bg-white/95 border-gray-200 text-[#0f0f0f] backdrop-blur-md'
      }`}
    >
      {/* Top Main Navigation Bar */}
      <div className="flex items-center justify-between px-3 sm:px-5 h-14 gap-2 sm:gap-4">
        {/* Left Section: Menu & YouTube Logo */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <button
            title="Toggle Controls"
            onClick={onToggleControlDrawer}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-[#272727]' : 'hover:bg-gray-100'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Authentic YouTube Logo */}
          <div
            onClick={() => onChangeViewMode('home')}
            className="flex items-center gap-1.5 cursor-pointer select-none group"
          >
            <div className="relative flex items-center justify-center w-8 h-5 sm:w-9 sm:h-6 bg-[#ff0000] rounded-lg shadow-sm">
              <div className="w-0 h-0 border-y-[4px] sm:border-y-[5px] border-y-transparent border-l-[8px] sm:border-l-[10px] border-l-white ml-0.5" />
            </div>
            <span className="font-bold tracking-tighter text-lg sm:text-xl font-sans">
              YouTube
            </span>
            <span
              className={`text-[9px] font-bold px-1 py-0.2 rounded uppercase tracking-wider ml-0.5 ${
                isDark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              CTR Lab
            </span>
          </div>
        </div>

        {/* Center Section: YouTube Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-xl mx-2"
        >
          <div className="flex items-center flex-1 w-full">
            <div
              className={`flex items-center flex-1 h-10 px-4 rounded-l-full border focus-within:border-blue-500 transition-colors ${
                isDark
                  ? 'bg-[#121212] border-[#303030] text-white'
                  : 'bg-white border-gray-300 text-black'
              }`}
            >
              <input
                type="text"
                placeholder="Search competitors (e.g. AI, gaming, podcast)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm placeholder:text-neutral-500"
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
              className={`flex items-center justify-center w-14 h-10 rounded-r-full border border-l-0 transition-colors ${
                isDark
                  ? 'bg-[#222222] border-[#303030] hover:bg-[#2a2a2a] text-neutral-300'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-neutral-700'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            title="Search with voice"
            className={`p-2.5 ml-2.5 rounded-full transition-colors flex-shrink-0 ${
              isDark ? 'bg-[#222222] hover:bg-[#2c2c2c] text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
        </form>

        {/* Right Section: View Switcher, Creator Bar Trigger & Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Creator Controls Toggle Button */}
          <button
            onClick={onToggleControlDrawer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              isControlDrawerOpen
                ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                : isDark
                ? 'bg-[#272727] hover:bg-[#333333] text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Thumbnail Controls</span>
          </button>

          {/* Blind Spot Pop Test Button */}
          <button
            onClick={onStartBlindTest}
            title="Test how fast your thumbnail catches attention in a crowded feed!"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:opacity-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Pop Test</span>
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-[#272727] text-neutral-300' : 'hover:bg-gray-100 text-neutral-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* User Profile avatar */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden ml-1 border border-white/20 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Sub-Header: Recommendation Views & Fast Switcher */}
      <div
        className={`flex items-center justify-between px-3 sm:px-5 py-1.5 border-t overflow-x-auto no-scrollbar gap-2 ${
          isDark ? 'border-[#222222] bg-[#141414]' : 'border-gray-100 bg-gray-50'
        }`}
      >
        {/* Recommendation View Pills */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-[11px] font-semibold uppercase tracking-wider mr-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Views:
          </span>

          <button
            onClick={() => onChangeViewMode('home')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              viewMode === 'home'
                ? isDark
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDark
                ? 'bg-[#272727] text-white hover:bg-[#333]'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Home Grid</span>
          </button>

          <button
            onClick={() => onChangeViewMode('sidebar')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              viewMode === 'sidebar'
                ? isDark
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDark
                ? 'bg-[#272727] text-white hover:bg-[#333]'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Watch Next (Sidebar)</span>
          </button>

          <button
            onClick={() => onChangeViewMode('search')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              viewMode === 'search'
                ? isDark
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDark
                ? 'bg-[#272727] text-white hover:bg-[#333]'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <SearchIcon className="w-3.5 h-3.5" />
            <span>Search Feed</span>
          </button>

          <button
            onClick={() => onChangeViewMode('mobile')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              viewMode === 'mobile'
                ? isDark
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDark
                ? 'bg-[#272727] text-white hover:bg-[#333]'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Phone</span>
          </button>

          <button
            onClick={() => onChangeViewMode('split')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              viewMode === 'split'
                ? isDark
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDark
                ? 'bg-[#272727] text-white hover:bg-[#333]'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <PlaySquare className="w-3.5 h-3.5" />
            <span>A/B Split Test</span>
          </button>
        </div>

        {/* Quick Testing Toggles */}
        <div className="flex items-center gap-2 flex-shrink-0 text-xs">
          {/* Squint / Blur quick toggle */}
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                blurAmount: prev.blurAmount > 0 ? 0 : 5,
              }))
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              settings.blurAmount > 0
                ? 'bg-blue-600 text-white font-semibold'
                : isDark
                ? 'bg-[#222] hover:bg-[#2a2a2a] text-neutral-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title="Squint Test: Blurs thumbnail to check if the main subject and composition pop out clearly"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Squint Test ({settings.blurAmount}px)</span>
          </button>

          {/* Grayscale toggle */}
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                grayscale: !prev.grayscale,
              }))
            }
            className={`px-2.5 py-1 rounded-md transition-colors ${
              settings.grayscale
                ? 'bg-purple-600 text-white font-semibold'
                : isDark
                ? 'bg-[#222] hover:bg-[#2a2a2a] text-neutral-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title="Grayscale Test: Checks pure black-and-white tonal contrast"
          >
            B&W Contrast
          </button>

          {/* Timestamp Danger Zone */}
          <button
            onClick={() =>
              onUpdateSettings((prev) => ({
                ...prev,
                showDangerZone: !prev.showDangerZone,
              }))
            }
            className={`px-2.5 py-1 rounded-md transition-colors ${
              settings.showDangerZone
                ? 'bg-red-600 text-white font-semibold'
                : isDark
                ? 'bg-[#222] hover:bg-[#2a2a2a] text-neutral-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title="Timestamp Danger Zone: See what gets covered by the 14:28 badge!"
          >
            Timestamp Zone
          </button>
        </div>
      </div>
    </header>
  );
};
