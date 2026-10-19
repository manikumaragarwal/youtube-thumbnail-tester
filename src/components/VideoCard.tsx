'use client';

import React from 'react';
import { YouTubeVideo, VisualTestSettings } from '@/types';
import { Check, Clock, ListPlus, MoreVertical, Sparkles } from 'lucide-react';

interface VideoCardProps {
  video: YouTubeVideo;
  settings: VisualTestSettings;
  layout?: 'grid' | 'sidebar' | 'search' | 'mobile';
  onUserVideoClick?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  settings,
  layout = 'grid',
  onUserVideoClick,
}) => {
  const isDark = settings.theme === 'dark';
  const isUser = !!video.isUserMock;

  const handleClick = () => {
    if (isUser && onUserVideoClick) {
      onUserVideoClick();
    }
  };

  // Thumbnail overlay elements (Timestamp, Danger Zone, Hover Actions, User Tag)
  const renderThumbnailOverlays = () => (
    <>
      {/* YouTube Duration Timestamp (Bottom Right) */}
      <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded tracking-wide pointer-events-none shadow-sm z-10">
        {video.duration}
      </span>

      {/* YouTube Hover Action Icons (Watch Later & Queue) */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20">
        <button
          title="Watch later"
          className="p-1.5 bg-black/80 text-white rounded hover:bg-black transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Clock className="w-3.5 h-3.5" />
        </button>
        <button
          title="Add to queue"
          className="p-1.5 bg-black/80 text-white rounded hover:bg-black transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ListPlus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Timestamp Danger Zone: Overlaid area that shows what YouTube covers! */}
      {settings.showDangerZone && (
        <div
          title="Danger Zone: YouTube timestamp badge covers this area!"
          className="absolute bottom-0 right-0 w-[30%] h-[24%] border-2 border-red-500 bg-red-500/30 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10 rounded-br-xl"
        >
          <span className="text-[10px] text-white font-bold bg-red-600/90 px-1 py-0.5 rounded uppercase tracking-wider scale-90">
            Stamp Zone
          </span>
        </div>
      )}

      {/* User Video Badge when highlighted */}
      {isUser && settings.highlightUserVideo && (
        <div className="absolute top-2 left-2 z-20 bg-amber-500 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-lg flex items-center gap-1 animate-pulse">
          <Sparkles className="w-3 h-3" />
          <span>{video.variantName || 'YOUR VIDEO'}</span>
        </div>
      )}
    </>
  );

  // 1. WATCH NEXT / SIDEBAR COMPACT LAYOUT
  if (layout === 'sidebar') {
    return (
      <div
        onClick={handleClick}
        className={`group flex gap-2.5 cursor-pointer rounded-xl p-1 transition-all duration-150 ${
          isUser && settings.highlightUserVideo
            ? 'ring-2 ring-amber-500/80 bg-amber-500/5'
            : isDark
            ? 'hover:bg-[#272727]/60'
            : 'hover:bg-gray-100'
        }`}
      >
        {/* Compact 16:9 Thumbnail (168px on YouTube) */}
        <div className="relative w-40 sm:w-44 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-800">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {renderThumbnailOverlays()}
        </div>

        {/* Text info */}
        <div className="flex flex-col flex-1 min-w-0 pr-1">
          <h3
            className={`text-sm font-medium leading-snug line-clamp-2 ${
              isDark ? 'text-white' : 'text-[#0f0f0f]'
            }`}
            title={video.title}
          >
            {video.title}
          </h3>

          <div
            className={`text-xs mt-1 flex items-center gap-1 ${
              isDark ? 'text-[#aaa]' : 'text-[#606060]'
            }`}
          >
            <span className="truncate hover:text-white transition-colors">
              {video.channelTitle}
            </span>
            {video.verified && (
              <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-gray-500 text-black">
                <Check className="w-2 h-2 text-white stroke-[3]" />
              </span>
            )}
          </div>

          <div
            className={`text-xs flex items-center gap-1 ${
              isDark ? 'text-[#aaa]' : 'text-[#606060]'
            }`}
          >
            <span>{video.viewCount}</span>
            <span>•</span>
            <span>{video.publishedTime}</span>
          </div>
        </div>

        <button
          className={`opacity-0 group-hover:opacity-100 self-start p-1 transition-opacity ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 2. SEARCH RESULTS LAYOUT (Wide horizontal cards)
  if (layout === 'search') {
    return (
      <div
        onClick={handleClick}
        className={`group flex flex-col sm:flex-row gap-4 cursor-pointer rounded-2xl p-2 transition-all ${
          isUser && settings.highlightUserVideo
            ? 'ring-2 ring-amber-500/80 bg-amber-500/5'
            : isDark
            ? 'hover:bg-[#272727]/40'
            : 'hover:bg-gray-100'
        }`}
      >
        <div className="relative w-full sm:w-80 md:w-96 flex-shrink-0 aspect-video rounded-xl overflow-hidden bg-gray-800">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {renderThumbnailOverlays()}
        </div>

        <div className="flex flex-col flex-1 justify-start py-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-base sm:text-lg font-medium leading-snug line-clamp-2 ${
                isDark ? 'text-white' : 'text-[#0f0f0f]'
              }`}
            >
              {video.title}
            </h3>
            <button
              className={`opacity-0 group-hover:opacity-100 p-1 transition-opacity ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div
            className={`text-xs mt-1 flex items-center gap-1.5 ${
              isDark ? 'text-[#aaa]' : 'text-[#606060]'
            }`}
          >
            <span>{video.viewCount}</span>
            <span>•</span>
            <span>{video.publishedTime}</span>
          </div>

          <div className="flex items-center gap-2.5 my-2.5">
            <img
              src={video.channelAvatarUrl}
              alt={video.channelTitle}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span
              className={`text-xs font-normal flex items-center gap-1 ${
                isDark ? 'text-[#aaa]' : 'text-[#606060]'
              }`}
            >
              {video.channelTitle}
              {video.verified && (
                <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-gray-500 text-black">
                  <Check className="w-2 h-2 text-white stroke-[3]" />
                </span>
              )}
            </span>
          </div>

          {video.description && (
            <p
              className={`text-xs line-clamp-2 leading-relaxed max-w-2xl ${
                isDark ? 'text-[#aaa]' : 'text-[#606060]'
              }`}
            >
              {video.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 3. MOBILE FEED LAYOUT
  if (layout === 'mobile') {
    return (
      <div
        onClick={handleClick}
        className={`group cursor-pointer mb-5 ${
          isUser && settings.highlightUserVideo ? 'ring-2 ring-amber-500 rounded-lg p-1' : ''
        }`}
      >
        <div className="relative w-full aspect-video overflow-hidden bg-gray-800">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {renderThumbnailOverlays()}
        </div>

        <div className="flex gap-3 px-3 pt-3">
          <img
            src={video.channelAvatarUrl}
            alt={video.channelTitle}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-normal leading-snug line-clamp-2 ${
                isDark ? 'text-white' : 'text-[#0f0f0f]'
              }`}
            >
              {video.title}
            </h3>
            <div
              className={`text-xs mt-0.5 flex flex-wrap items-center gap-1 ${
                isDark ? 'text-[#aaa]' : 'text-[#606060]'
              }`}
            >
              <span>{video.channelTitle}</span>
              <span>•</span>
              <span>{video.viewCount}</span>
              <span>•</span>
              <span>{video.publishedTime}</span>
            </div>
          </div>
          <button className={`p-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 4. DEFAULT: STANDARD DESKTOP HOME FEED GRID CARD
  return (
    <div
      onClick={handleClick}
      className={`group flex flex-col cursor-pointer transition-all duration-200 ${
        isUser && settings.highlightUserVideo
          ? 'ring-4 ring-amber-500/90 rounded-2xl p-1.5 bg-amber-500/10 shadow-xl shadow-amber-500/10'
          : ''
      }`}
    >
      {/* 16:9 Thumbnail with Rounded Corners */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 shadow-sm">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {renderThumbnailOverlays()}
      </div>

      {/* Metadata Row: Avatar + Title & Stats */}
      <div className="flex gap-3 pt-3 px-0.5">
        <div className="flex-shrink-0">
          <img
            src={video.channelAvatarUrl}
            alt={video.channelTitle}
            className="w-9 h-9 rounded-full object-cover border border-white/10"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <h3
            className={`text-sm sm:text-[15px] font-semibold leading-tight line-clamp-2 transition-colors ${
              isDark ? 'text-[#f1f1f1]' : 'text-[#0f0f0f]'
            }`}
            title={video.title}
          >
            {video.title}
          </h3>

          <div
            className={`text-[12px] sm:text-[13px] mt-1.5 flex items-center gap-1 transition-colors ${
              isDark ? 'text-[#aaa] hover:text-white' : 'text-[#606060] hover:text-black'
            }`}
          >
            <span className="truncate">{video.channelTitle}</span>
            {video.verified && (
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-neutral-500 text-white flex-shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>

          <div
            className={`text-[12px] sm:text-[13px] flex items-center gap-1.5 ${
              isDark ? 'text-[#aaa]' : 'text-[#606060]'
            }`}
          >
            <span>{video.viewCount}</span>
            <span className="text-[10px]">•</span>
            <span>{video.publishedTime}</span>
          </div>
        </div>

        <button
          className={`opacity-0 group-hover:opacity-100 self-start p-1 transition-opacity ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
