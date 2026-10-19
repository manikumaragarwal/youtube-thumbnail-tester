'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ThumbnailVariant,
  VisualTestSettings,
} from '@/types';
import { PRESET_THUMBNAILS } from '@/lib/mock-youtube-data';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  Trash2,
  Sliders,
  Type,
  Sparkles,
  Eye,
  AlertTriangle,
  Shuffle,
  Link as LinkIcon,
} from 'lucide-react';

interface TestControlPanelProps {
  variants: ThumbnailVariant[];
  activeVariantId: string;
  onSelectVariant: (id: string) => void;
  onUpdateVariant: (id: string, updates: Partial<ThumbnailVariant>) => void;
  onAddVariant: () => void;
  onDeleteVariant: (id: string) => void;
  settings: VisualTestSettings;
  onUpdateSettings: (updater: (prev: VisualTestSettings) => VisualTestSettings) => void;
  isOpen: boolean;
  onClose: () => void;
  totalFeedVideos: number;
}

export const TestControlPanel: React.FC<TestControlPanelProps> = ({
  variants,
  activeVariantId,
  onSelectVariant,
  onUpdateVariant,
  onAddVariant,
  onDeleteVariant,
  settings,
  onUpdateSettings,
  isOpen,
  onClose,
  totalFeedVideos,
}) => {
  const activeVariant =
    variants.find((v) => v.id === activeVariantId) || variants[0];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'visuals' | 'metadata'>('content');

  // Global Clipboard Paste listener so user can simply press Ctrl+V anywhere to paste a thumbnail!
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                onUpdateVariant(activeVariant.id, {
                  thumbnailUrl: event.target.result as string,
                });
              }
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [activeVariant?.id, onUpdateVariant]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateVariant(activeVariant.id, {
            thumbnailUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateVariant(activeVariant.id, {
            channelAvatarUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUpdateVariant(activeVariant.id, {
        thumbnailUrl: urlInput.trim(),
      });
      setUrlInput('');
    }
  };

  // Title case helper
  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  // Title character length assessment
  const titleLength = activeVariant?.title.length || 0;
  const getLengthBadge = () => {
    if (titleLength === 0) return null;
    if (titleLength <= 50) {
      return (
        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Optimal desktop & mobile length
        </span>
      );
    }
    if (titleLength <= 70) {
      return (
        <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Good, but may truncate on small phones
        </span>
      );
    }
    return (
      <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Over 70 characters: YouTube will cut off with &quot;...&quot;
      </span>
    );
  };

  if (!isOpen) return null;

  const isDark = settings.theme === 'dark';

  return (
    <div
      className={`w-full border-b transition-all duration-200 shadow-2xl relative z-30 ${
        isDark ? 'bg-[#181818] border-[#2e2e2e] text-white' : 'bg-white border-gray-200 text-[#0f0f0f]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
        {/* Top Bar: Variant Tabs & Close */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          {/* Variant Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Variants:
            </span>

            {variants.map((v) => (
              <div key={v.id} className="flex items-center">
                <button
                  onClick={() => onSelectVariant(v.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    v.id === activeVariantId
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : isDark
                      ? 'bg-[#272727] hover:bg-[#333] text-neutral-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  <span>{v.name}</span>
                  {v.thumbnailUrl && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>

                {variants.length > 1 && (
                  <button
                    onClick={() => onDeleteVariant(v.id)}
                    title="Delete this variant"
                    className="p-1 text-neutral-400 hover:text-rose-500 transition-colors ml-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {variants.length < 4 && (
              <button
                onClick={onAddVariant}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-dashed border-neutral-500 hover:border-amber-400 text-neutral-300 hover:text-amber-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            )}
          </div>

          {/* Navigation Sub-Tabs & Close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-black/20 rounded-lg p-0.5 text-xs font-medium border border-white/10">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'content'
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                Thumbnail & Title
              </button>
              <button
                onClick={() => setActiveTab('visuals')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'visuals'
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                Standout Tools
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'metadata'
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                Channel & Meta
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-2"
              title="Close panel"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab 1: Content (Thumbnail & Title) */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4">
            {/* Left: Thumbnail Upload & Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  Thumbnail Image
                </label>
                <span className="text-[11px] text-neutral-400">16:9 • Drag & drop or paste</span>
              </div>

              {/* Drag/Drop and Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${
                  activeVariant.thumbnailUrl
                    ? 'border-amber-500/50 bg-black/40'
                    : 'border-neutral-600 hover:border-amber-400 bg-neutral-900/60'
                }`}
              >
                {activeVariant.thumbnailUrl ? (
                  <>
                    <img
                      src={activeVariant.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                      <Upload className="w-6 h-6 mb-1 text-amber-400" />
                      <span className="text-xs font-semibold">Click or drop to replace</span>
                      <span className="text-[10px] text-neutral-300">Or press Ctrl+V anytime</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <Upload className="w-8 h-8 text-neutral-400 mb-2 group-hover:text-amber-400 transition-colors" />
                    <span className="text-xs font-semibold text-neutral-200">
                      Upload your YouTube thumbnail
                    </span>
                    <span className="text-[11px] text-neutral-400 mt-1">
                      Drag & Drop, browse file, or press <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-amber-400 font-mono">Ctrl+V</kbd>
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Image URL Input */}
              <form onSubmit={handleUrlSubmit} className="flex gap-1.5">
                <div className="relative flex-1">
                  <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="url"
                    placeholder="Or paste direct image URL..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 bg-black/30 border border-white/10 rounded-lg text-xs focus:outline-none focus:border-amber-400 text-white placeholder:text-neutral-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 h-8 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-lg text-neutral-200 transition-colors"
                >
                  Load
                </button>
              </form>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">
                  Try Presets:
                </span>
                {PRESET_THUMBNAILS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onUpdateVariant(activeVariant.id, {
                        thumbnailUrl: preset.url,
                        title: preset.title,
                      });
                    }}
                    className="text-[11px] px-2 py-0.5 rounded bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 border border-white/5 text-neutral-300 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Title & Formatting (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-amber-400" />
                    Video Title
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold ${
                        titleLength > 70
                          ? 'text-rose-400'
                          : titleLength > 50
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {titleLength} / 100 chars
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={2}
                    value={activeVariant.title}
                    onChange={(e) =>
                      onUpdateVariant(activeVariant.id, {
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter an attention-grabbing YouTube video title..."
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-sm leading-relaxed text-white focus:outline-none focus:border-amber-400 placeholder:text-neutral-500 resize-none font-medium"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>{getLengthBadge()}</div>

                  {/* Formatting quick actions */}
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-neutral-400 mr-1">Case:</span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateVariant(activeVariant.id, {
                          title: toTitleCase(activeVariant.title),
                        })
                      }
                      className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-neutral-200"
                    >
                      Title Case
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateVariant(activeVariant.id, {
                          title: activeVariant.title.toUpperCase(),
                        })
                      }
                      className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-neutral-200"
                    >
                      ALL CAPS
                    </button>
                  </div>
                </div>
              </div>

              {/* Feed Placement & Positioning */}
              <div className="p-3 rounded-xl bg-black/20 border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-neutral-300">
                    Feed Position:
                  </span>
                  <div className="flex items-center gap-1">
                    {[0, 1, 3, 5, 8].map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() =>
                          onUpdateSettings((prev) => ({
                            ...prev,
                            slotPosition: pos,
                          }))
                        }
                        className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                          settings.slotPosition === pos
                            ? 'bg-amber-500 text-black'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                        }`}
                      >
                        #{pos + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          slotPosition: Math.floor(Math.random() * Math.min(totalFeedVideos, 12)),
                        }))
                      }
                      title="Randomize placement"
                      className="flex items-center gap-1 px-2.5 h-7 rounded text-xs bg-white/5 hover:bg-white/10 text-neutral-300"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>Random</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-neutral-300 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.highlightUserVideo}
                      onChange={(e) =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          highlightUserVideo: e.target.checked,
                        }))
                      }
                      className="rounded accent-amber-500 w-3.5 h-3.5"
                    />
                    <span>Highlight with Gold Border</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Standout & Squint Test Suite */}
        {activeTab === 'visuals' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            {/* 1. Squint / Blur Test */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    Squint Test (Blur)
                  </h4>
                  <span className="text-xs font-mono font-bold">
                    {settings.blurAmount}px
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Blurs the screen to simulate rapid eye scanning. If your main subject, text, or focal point disappears, viewers will scroll right past it!
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={settings.blurAmount}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      blurAmount: parseInt(e.target.value),
                    }))
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>Sharp (0px)</span>
                  <span>Normal Squint (4px)</span>
                  <span>Heavy Blur (12px)</span>
                </div>
              </div>
            </div>

            {/* 2. Contrast & Grayscale Test */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" />
                    Tonal Contrast Check
                  </h4>
                  <span className="text-xs font-semibold">
                    {settings.grayscale ? 'B&W Active' : 'Color'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Converts the entire feed to pure black & white. Tests whether your thumbnail has high luminance contrast or turns into muddy gray.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    grayscale: !prev.grayscale,
                  }))
                }
                className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                  settings.grayscale
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200'
                }`}
              >
                {settings.grayscale ? 'Turn Color Back On' : 'Check Black & White Contrast'}
              </button>
            </div>

            {/* 3. Danger Zone (Timestamp Overlap) */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Timestamp Danger Zone
                  </h4>
                  <span className="text-xs font-semibold">
                    {settings.showDangerZone ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  YouTube permanently stamps the video duration (e.g. 14:28) in the bottom-right corner. Never place text or crucial faces there!
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    showDangerZone: !prev.showDangerZone,
                  }))
                }
                className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                  settings.showDangerZone
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200'
                }`}
              >
                {settings.showDangerZone ? 'Hide Danger Overlay' : 'Show Timestamp Danger Zone'}
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Channel & Metadata Customization */}
        {activeTab === 'metadata' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {/* Channel Name */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">
                Channel Name
              </label>
              <input
                type="text"
                value={activeVariant.channelTitle}
                onChange={(e) =>
                  onUpdateVariant(activeVariant.id, {
                    channelTitle: e.target.value,
                  })
                }
                className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* View Count */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">
                View Count Display
              </label>
              <input
                type="text"
                value={activeVariant.viewCount}
                onChange={(e) =>
                  onUpdateVariant(activeVariant.id, {
                    viewCount: e.target.value,
                  })
                }
                placeholder="e.g. 1.2M views, 24K views"
                className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Published Time */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">
                Published Time
              </label>
              <input
                type="text"
                value={activeVariant.publishedTime}
                onChange={(e) =>
                  onUpdateVariant(activeVariant.id, {
                    publishedTime: e.target.value,
                  })
                }
                placeholder="e.g. 2 hours ago, 1 day ago"
                className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Video Duration */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">
                Duration Badge
              </label>
              <input
                type="text"
                value={activeVariant.duration}
                onChange={(e) =>
                  onUpdateVariant(activeVariant.id, {
                    duration: e.target.value,
                  })
                }
                placeholder="e.g. 14:28"
                className="w-full h-9 px-3 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Channel Avatar & Verified badge */}
            <div className="sm:col-span-2 md:col-span-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={activeVariant.channelAvatarUrl}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Change Avatar Photo
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={activeVariant.verified}
                  onChange={(e) =>
                    onUpdateVariant(activeVariant.id, {
                      verified: e.target.checked,
                    })
                  }
                  className="rounded accent-amber-500 w-3.5 h-3.5"
                />
                <span>Verified Channel Checkmark</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
