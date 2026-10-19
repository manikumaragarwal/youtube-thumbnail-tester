'use client';

import React, { useState, useEffect } from 'react';
import { YouTubeVideo, VisualTestSettings } from '@/types';
import { Check, Clock, ListPlus, MoreVertical, Sparkles } from 'lucide-react';
import { getFallbackThumbnail } from '@/lib/mock-youtube-data';

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

  const [currentThumb, setCurrentThumb] = useState<string>(video.thumbnailUrl);
  const [hasError, setHasError] = useState(false);

  // Sync if video prop changes
  useEffect(() => {
    setCurrentThumb(video.thumbnailUrl);
    setHasError(false);
  }, [video.thumbnailUrl]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentThumb(getFallbackThumbnail(video.id, video.category));
    }
  };

  const handleClick = () => {
    if (isUser && onUserVideoClick) {
      onUserVideoClick();
    }
  };

  // Thumbnail overlay elements (Timestamp, Danger Zone, Hover Actions, User Tag)
  const renderThumbnailOverlays = () => (
    <>
      {/* YouTube Duration Timestamp (Bottom Right) */}
      <span className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-[2px] text-white text-[11px] font-semibold px-1.5 py-0.5 rounded tracking-wide pointer-events-none z-10 select-none">
        {video.duration}
      </span>

      {/* YouTube Hover Action Icons */}
      <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20">
        <button
          title="Watch later"
          className="p-1.5 bg-black/80 text-white rounded-md hover:bg-black transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Clock className="w-3.5 h-3.5" />
        </button>
        <button
          title="Add to queue"
          className="p-1.5 bg-black/80 text-white rounded-md hover:bg-black transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ListPlus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Timestamp Danger Zone: Visual overlay showing what YouTube's badge covers */}
      {settings.showDangerZone && (
        <div
          title="Danger Zone: YouTube timestamp badge covers this area!"
          className="absolute bottom-0 right-0 w-[30%] h-[26%] border-2 border-red-500/80 bg-red-600/30 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10 rounded-br-xl"
        >
          <span className="text-[9px] text-white font-bold bg-red-600 px-1 py-0.2 rounded uppercase tracking-wider scale-90 shadow">
            STAMP
          </span>
        </div>
      )}

      {/* User Video Badge when highlighted */}
      {isUser && settings.highlightUserVideo && (
        <div className="absolute top-2 left-2 z-20 bg-amber-500 text-black text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 select-none">
          <Sparkles className="w-3 h-3 fill-black" />
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
        className={`group flex gap-3 cursor-pointer rounded-xl p-1 transition-all duration-150 ${
          isUser && settings.highlightUserVideo
            ? 'ring-2 ring-amber-500 bg-amber-500/10 shadow-lg'
            : isDark
            ? 'hover:bg-[#272727]/70'
            : 'hover:bg-gray-100'
        }`}
      >
        {/* Compact 16:9 Thumbnail (168px on YouTube) */}
        <div className="relative w-40 sm:w-44 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-neutral-800">
          <img
            src={currentThumb}
            alt={video.title}
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {renderThumbnailOverlays()}
        </div>

        {/* Text info */}
        <div className="flex flex-col flex-1 min-w-0 pr-1 justify-center">
          <h3
            className={`text-[13px] font-medium leading-[1.3] line-clamp-2 ${
              isDark ? 'text-neutral-100' : 'text-[#0f0f0f]'
            }`}
            title={video.title}
          >
            {video.title}
          </h3>

          <div
            className={`text-[12px] mt-1 flex items-center gap-1 ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            <span className="truncate hover:text-white transition-colors">
              {video.channelTitle}
            </span>
            {video.verified && (
              <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-neutral-500 text-black">
                <Check className="w-2 h-2 text-white stroke-[3]" />
              </span>
            )}
          </div>

          <div
            className={`text-[11px] flex items-center gap-1 mt-0.5 ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            <span>{video.viewCount}</span>
            <span>•</span>
            <span>{video.publishedTime}</span>
          </div>
        </div>

        <button
          className={`opacity-0 group-hover:opacity-100 self-start p-1 transition-opacity ${
            isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
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
            ? 'ring-2 ring-amber-500 bg-amber-500/10 shadow-lg'
            : isDark
            ? 'hover:bg-[#272727]/50'
            : 'hover:bg-gray-100'
        }`}
      >
        <div className="relative w-full sm:w-80 md:w-96 flex-shrink-0 aspect-video rounded-xl overflow-hidden bg-neutral-800">
          <img
            src={currentThumb}
            alt={video.title}
            onError={handleImageError}
            referrerPolicy="no-referrer"
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
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div
            className={`text-xs mt-1 flex items-center gap-1.5 ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
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
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span
              className={`text-xs font-normal flex items-center gap-1 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              {video.channelTitle}
              {video.verified && (
                <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-neutral-500 text-black">
                  <Check className="w-2 h-2 text-white stroke-[3]" />
                </span>
              )}
            </span>
          </div>

          {video.description && (
            <p
              className={`text-xs line-clamp-2 leading-relaxed max-w-2xl ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
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
        <div className="relative w-full aspect-video overflow-hidden bg-neutral-800">
          <img
            src={currentThumb}
            alt={video.title}
            onError={handleImageError}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {renderThumbnailOverlays()}
        </div>

        <div className="flex gap-3 px-3 pt-3">
          <img
            src={video.channelAvatarUrl}
            alt={video.channelTitle}
            referrerPolicy="no-referrer"
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
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              <span>{video.channelTitle}</span>
              <span>•</span>
              <span>{video.viewCount}</span>
              <span>•</span>
              <span>{video.publishedTime}</span>
            </div>
          </div>
          <button className={`p-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
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
          ? 'ring-2 ring-amber-500 rounded-2xl p-1.5 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
          : ''
      }`}
    >
      {/* 16:9 Thumbnail with Rounded Corners */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 shadow-sm">
        <img
          src={currentThumb}
          alt={video.title}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-250 group-hover:scale-[1.02]"
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
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-white/10"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <h3
            className={`text-[14px] sm:text-[15px] font-semibold leading-[1.3] line-clamp-2 transition-colors ${
              isDark ? 'text-[#f1f1f1] group-hover:text-white' : 'text-[#0f0f0f]'
            }`}
            title={video.title}
          >
            {video.title}
          </h3>

          <div
            className={`text-[12px] mt-1.5 flex items-center gap-1 transition-colors ${
              isDark ? 'text-neutral-400 group-hover:text-neutral-200' : 'text-[#606060]'
            }`}
          >
            <span className="truncate">{video.channelTitle}</span>
            {video.verified && (
              <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-neutral-500 text-white flex-shrink-0">
                <Check className="w-2 h-2 stroke-[3]" />
              </span>
            )}
          </div>

          <div
            className={`text-[12px] flex items-center gap-1.5 mt-0.5 ${
              isDark ? 'text-neutral-400' : 'text-[#606060]'
            }`}
          >
            <span>{video.viewCount}</span>
            <span className="text-[9px]">•</span>
            <span>{video.publishedTime}</span>
          </div>
        </div>

        <button
          className={`opacity-0 group-hover:opacity-100 self-start p-1 transition-opacity ${
            isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
