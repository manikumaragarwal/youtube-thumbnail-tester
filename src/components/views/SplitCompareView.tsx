'use client';

import React from 'react';
import { ThumbnailVariant, VisualTestSettings, YouTubeVideo } from '@/types';
import { VideoCard } from '@/components/VideoCard';
import { Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SplitCompareViewProps {
  variants: ThumbnailVariant[];
  baseVideos: YouTubeVideo[];
  settings: VisualTestSettings;
  onSelectWinningVariant?: (variantId: string) => void;
}

export const SplitCompareView: React.FC<SplitCompareViewProps> = ({
  variants,
  baseVideos,
  settings,
}) => {
  const isDark = settings.theme === 'dark';

  const varA = variants[0];
  const varB = variants[1] || variants[0];

  // Helper to inject a variant into videos list
  const injectVariant = (variant: ThumbnailVariant, label: string) => {
    const userVideo: YouTubeVideo = {
      id: `user-${variant.id}`,
      title: variant.title,
      thumbnailUrl: variant.thumbnailUrl,
      channelTitle: variant.channelTitle,
      channelAvatarUrl: variant.channelAvatarUrl,
      viewCount: variant.viewCount,
      publishedTime: variant.publishedTime,
      duration: variant.duration,
      verified: variant.verified,
      category: 'UserTest',
      isUserMock: true,
      variantName: label,
    };

    const copy = [...baseVideos];
    copy.splice(settings.slotPosition, 0, userVideo);
    return copy.slice(0, 8);
  };

  const feedA = injectVariant(varA, varA.name);
  const feedB = injectVariant(varB, varB.name);

  const handleVoteWinner = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4">
      {/* Compare Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          A/B Split Test Comparison
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl mx-auto">
          Compare two variants inside identical YouTube home feeds side by side. Look away, then look back quickly to see which thumbnail captures your gaze first!
        </p>
      </div>

      {/* Side-by-Side Dual Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Variant A Column */}
        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#141414] border-[#272727]' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Option 1:
              </span>
              <h3 className="text-base font-bold">{varA.name}</h3>
            </div>
            <button
              onClick={() => handleVoteWinner()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Pops More!</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedA.map((video) => (
              <VideoCard
                key={`feedA-${video.id}`}
                video={video}
                settings={settings}
                layout="grid"
              />
            ))}
          </div>
        </div>

        {/* Variant B Column */}
        <div
          className={`p-4 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#141414] border-[#272727]' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Option 2:
              </span>
              <h3 className="text-base font-bold">{varB.name}</h3>
            </div>
            <button
              onClick={() => handleVoteWinner()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Pops More!</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedB.map((video) => (
              <VideoCard
                key={`feedB-${video.id}`}
                video={video}
                settings={settings}
                layout="grid"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
