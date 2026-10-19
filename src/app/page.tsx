'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  YouTubeVideo,
  ThumbnailVariant,
  ViewMode,
  CategoryFilter,
  VisualTestSettings,
} from '@/types';
import { INITIAL_YOUTUBE_VIDEOS, PRESET_THUMBNAILS } from '@/lib/mock-youtube-data';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TestControlPanel } from '@/components/TestControlPanel';
import { HomeFeedView } from '@/components/views/HomeFeedView';
import { SidebarWatchView } from '@/components/views/SidebarWatchView';
import { SearchResultsView } from '@/components/views/SearchResultsView';
import { MobileFeedView } from '@/components/views/MobileFeedView';
import { SplitCompareView } from '@/components/views/SplitCompareView';
import { BlindTestModal } from '@/components/BlindTestModal';
import { Clock } from 'lucide-react';

const CATEGORIES: CategoryFilter[] = [
  'All',
  'Technology',
  'Gaming',
  'Podcasts',
  'Education',
  'Entertainment',
  'Business',
  'Science',
  'Music',
];

interface BlindTimerData {
  timer: NodeJS.Timeout;
  startTime: number;
}

declare global {
  interface Window {
    __blindTimer?: BlindTimerData;
  }
}

export default function Home() {
  // 1. User Thumbnail & Title Variants
  const [variants, setVariants] = useState<ThumbnailVariant[]>([
    {
      id: 'var-1',
      name: 'Variant A',
      title: 'I Built a Quantum Computer in My Bedroom (It Actually Works!)',
      thumbnailUrl: PRESET_THUMBNAILS[0].url,
      channelTitle: 'Tech Pulse',
      channelAvatarUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      viewCount: '24K views',
      publishedTime: '3 hours ago',
      duration: '14:28',
      verified: true,
    },
    {
      id: 'var-2',
      name: 'Variant B',
      title: 'Why Quantum Computers Are 1000x More Dangerous Than You Think',
      thumbnailUrl: PRESET_THUMBNAILS[2].url,
      channelTitle: 'Tech Pulse',
      channelAvatarUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      viewCount: '24K views',
      publishedTime: '3 hours ago',
      duration: '14:28',
      verified: true,
    },
  ]);

  const [activeVariantId, setActiveVariantId] = useState<string>('var-1');
  const activeVariant =
    variants.find((v) => v.id === activeVariantId) || variants[0];

  // 2. Base Competitor Videos (from YouTube)
  const [baseVideos, setBaseVideos] = useState<YouTubeVideo[]>(INITIAL_YOUTUBE_VIDEOS);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 3. UI and View Settings
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isControlDrawerOpen, setIsControlDrawerOpen] = useState<boolean>(true);

  // 4. Standout & CTR Testing Settings
  const [settings, setSettings] = useState<VisualTestSettings>({
    theme: 'dark',
    blurAmount: 0,
    grayscale: false,
    scale: 1,
    highlightUserVideo: true,
    slotPosition: 1, // 2nd card in feed
    showDangerZone: false,
    blindMode: false,
    blindStartTime: null,
    blindFoundTime: null,
  });

  // 5. Blind Pop Test Game State
  const [isBlindModalOpen, setIsBlindModalOpen] = useState<boolean>(false);
  const [blindGameState, setBlindGameState] = useState<
    'idle' | 'countdown' | 'playing' | 'success'
  >('idle');
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Fetch videos on category change
  const handleSelectCategory = async (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/youtube?category=${encodeURIComponent(cat)}`);
      const data = await res.json();
      if (data.videos) {
        setBaseVideos(data.videos);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch videos on search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.videos) {
        setBaseVideos(data.videos);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Add Variant
  const handleAddVariant = () => {
    const nextLetter = String.fromCharCode(65 + variants.length);
    const newVariant: ThumbnailVariant = {
      id: `var-${Date.now()}`,
      name: `Variant ${nextLetter}`,
      title: activeVariant.title,
      thumbnailUrl: activeVariant.thumbnailUrl,
      channelTitle: activeVariant.channelTitle,
      channelAvatarUrl: activeVariant.channelAvatarUrl,
      viewCount: activeVariant.viewCount,
      publishedTime: activeVariant.publishedTime,
      duration: activeVariant.duration,
      verified: activeVariant.verified,
    };
    setVariants((prev) => [...prev, newVariant]);
    setActiveVariantId(newVariant.id);
  };

  // Delete Variant
  const handleDeleteVariant = (id: string) => {
    if (variants.length <= 1) return;
    const filtered = variants.filter((v) => v.id !== id);
    setVariants(filtered);
    if (activeVariantId === id) {
      setActiveVariantId(filtered[0].id);
    }
  };

  // Update Variant
  const handleUpdateVariant = useCallback((id: string, updates: Partial<ThumbnailVariant>) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  }, []);

  // Assemble full feed with User's video injected at slotPosition
  const feedWithUserVideo = useMemo(() => {
    const userVideo: YouTubeVideo = {
      id: `user-video-${activeVariant.id}`,
      title: activeVariant.title || 'My YouTube Video Title',
      thumbnailUrl:
        activeVariant.thumbnailUrl ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1280&auto=format&fit=crop&q=80',
      channelTitle: activeVariant.channelTitle || 'My Channel',
      channelAvatarUrl:
        activeVariant.channelAvatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      viewCount: activeVariant.viewCount || '10K views',
      publishedTime: activeVariant.publishedTime || 'Just now',
      duration: activeVariant.duration || '12:34',
      verified: activeVariant.verified,
      category: 'UserTest',
      description:
        'This is your mock video placed inside the real YouTube feed. Test how well your title and thumbnail stand out against neighboring videos.',
      isUserMock: true,
      variantName: activeVariant.name,
    };

    const list = [...baseVideos];
    const safeIndex = Math.min(
      Math.max(0, settings.slotPosition),
      Math.max(0, list.length)
    );
    list.splice(safeIndex, 0, userVideo);
    return list;
  }, [baseVideos, activeVariant, settings.slotPosition]);

  // Blind Pop Test Game Handlers
  const handleStartBlindTest = () => {
    setIsBlindModalOpen(true);
    setBlindGameState('idle');
  };

  const handleStartGameCountdown = () => {
    // Randomize slot position
    const randomSlot = Math.floor(Math.random() * Math.min(12, baseVideos.length));
    setSettings((prev) => ({
      ...prev,
      slotPosition: randomSlot,
      highlightUserVideo: false, // Turn off gold border during blind test
    }));
    setIsControlDrawerOpen(false); // Close controls
    setBlindGameState('countdown');

    setTimeout(() => {
      setBlindGameState('playing');
      setIsBlindModalOpen(false); // Hide modal so user can view feed!
      const startTime = performance.now();

      // Setup global stopwatch ticker
      const timer = setInterval(() => {
        setElapsedTime(performance.now() - startTime);
      }, 50);

      window.__blindTimer = { timer, startTime };
    }, 3000);
  };

  const handleUserVideoClick = () => {
    if (blindGameState === 'playing' && window.__blindTimer) {
      clearInterval(window.__blindTimer.timer);
      const finalTime = performance.now() - window.__blindTimer.startTime;
      setElapsedTime(finalTime);
      setBlindGameState('success');
      setIsBlindModalOpen(true);
      // Turn highlight back on
      setSettings((prev) => ({ ...prev, highlightUserVideo: true }));
    }
  };

  const isDark = settings.theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#0f0f0f] text-[#f1f1f1]' : 'bg-white text-[#0f0f0f]'
      }`}
    >
      {/* YouTube Navigation Header */}
      <Header
        settings={settings}
        onUpdateSettings={setSettings}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onSearch={handleSearch}
        onToggleControlDrawer={() => setIsControlDrawerOpen((prev) => !prev)}
        isControlDrawerOpen={isControlDrawerOpen}
        onStartBlindTest={handleStartBlindTest}
      />

      {/* Floating Active Stopwatch when Blind Test is running */}
      {blindGameState === 'playing' && (
        <div className="fixed top-16 right-6 z-50 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-pulse border-2 border-white">
          <Clock className="w-4 h-4 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Spot Your Video:
          </span>
          <span className="font-mono text-sm font-black">
            {(elapsedTime / 1000).toFixed(2)}s
          </span>
        </div>
      )}

      {/* Creator Testing Cockpit Panel (Collapsible) */}
      <TestControlPanel
        variants={variants}
        activeVariantId={activeVariantId}
        onSelectVariant={setActiveVariantId}
        onUpdateVariant={handleUpdateVariant}
        onAddVariant={handleAddVariant}
        onDeleteVariant={handleDeleteVariant}
        settings={settings}
        onUpdateSettings={setSettings}
        isOpen={isControlDrawerOpen}
        onClose={() => setIsControlDrawerOpen(false)}
        totalFeedVideos={baseVideos.length}
      />

      {/* Main YouTube Layout Container */}
      <div className="flex-1 flex w-full">
        {/* Left Navigation Sidebar (Shown in Home and Watch modes) */}
        {viewMode !== 'mobile' && viewMode !== 'split' && (
          <Sidebar
            isDark={isDark}
            isCollapsed={isSidebarCollapsed}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
          />
        )}

        {/* View Surface with Visual Filters (Squint Blur & Grayscale) */}
        <main
          className="flex-1 min-w-0 transition-all duration-150 overflow-x-hidden"
          style={{
            filter: `blur(${settings.blurAmount}px) grayscale(${
              settings.grayscale ? 1 : 0
            })`,
          }}
        >
          {/* Loading Indicator */}
          {isLoading && (
            <div className="w-full h-1 bg-red-600 animate-pulse" />
          )}

          {/* VIEW 1: HOME FEED GRID */}
          {viewMode === 'home' && (
            <HomeFeedView
              videos={feedWithUserVideo}
              settings={settings}
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              onUserVideoClick={handleUserVideoClick}
            />
          )}

          {/* VIEW 2: WATCH PAGE WITH SIDEBAR RECOMMENDATIONS */}
          {viewMode === 'sidebar' && (
            <SidebarWatchView
              videos={feedWithUserVideo}
              settings={settings}
              onUserVideoClick={handleUserVideoClick}
            />
          )}

          {/* VIEW 3: SEARCH RESULTS LIST */}
          {viewMode === 'search' && (
            <SearchResultsView
              videos={feedWithUserVideo}
              settings={settings}
              searchQuery={searchQuery}
              onUserVideoClick={handleUserVideoClick}
            />
          )}

          {/* VIEW 4: SMARTPHONE MOBILE APP FEED */}
          {viewMode === 'mobile' && (
            <MobileFeedView
              videos={feedWithUserVideo}
              settings={settings}
              onUserVideoClick={handleUserVideoClick}
            />
          )}

          {/* VIEW 5: A/B SPLIT TEST COMPARISON */}
          {viewMode === 'split' && (
            <SplitCompareView
              variants={variants}
              baseVideos={baseVideos}
              settings={settings}
            />
          )}
        </main>
      </div>

      {/* Blind Pop Test Game Modal */}
      <BlindTestModal
        isOpen={isBlindModalOpen}
        onClose={() => setIsBlindModalOpen(false)}
        onStartGame={handleStartGameCountdown}
        gameState={blindGameState}
        elapsedTime={elapsedTime}
        onPlayAgain={handleStartGameCountdown}
      />
    </div>
  );
}
