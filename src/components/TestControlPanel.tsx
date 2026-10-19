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
  Type,
  Sparkles,
  AlertTriangle,
  Shuffle,
  Link as LinkIcon,
  X,
  BadgeCheck,
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
  const [urlInput, setUrlInput] = useState('');

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

  const titleLength = activeVariant?.title.length || 0;
  const isDark = settings.theme === 'dark';

  if (!isOpen) return null;

  return (
    <section
      className={`w-full border-b transition-colors shadow-xl relative z-30 ${
        isDark
          ? 'bg-[#161616]/95 border-neutral-800 text-white backdrop-blur-xl'
          : 'bg-white/95 border-gray-200 text-[#0f0f0f] backdrop-blur-xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
        {/* Top Header: Variant Pills & Close */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mr-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>A/B Variants:</span>
            </span>

            {variants.map((v) => (
              <div key={v.id} className="flex items-center">
                <button
                  onClick={() => onSelectVariant(v.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                    v.id === activeVariantId
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : isDark
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${v.id === activeVariantId ? 'bg-black' : 'bg-amber-400'}`} />
                  <span>{v.name}</span>
                </button>

                {variants.length > 1 && (
                  <button
                    onClick={() => onDeleteVariant(v.id)}
                    title="Remove variant"
                    className="p-1 text-neutral-500 hover:text-red-400 transition-colors ml-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {variants.length < 4 && (
              <button
                onClick={onAddVariant}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-neutral-600 hover:border-amber-400 text-neutral-400 hover:text-amber-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Variant</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Minimize drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main 2-Column Clean Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          {/* Left Column: Thumbnail Dropzone & Inputs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Thumbnail Image</span>
              </label>
              <span className="text-[11px] text-neutral-500">16:9 • Drag, file, or Ctrl+V</span>
            </div>

            {/* Click/Drag Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative group aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${
                activeVariant.thumbnailUrl
                  ? 'border-amber-500/40 bg-neutral-900 shadow-inner'
                  : 'border-neutral-700 hover:border-amber-400 bg-neutral-900/50'
              }`}
            >
              {activeVariant.thumbnailUrl ? (
                <>
                  <img
                    src={activeVariant.thumbnailUrl}
                    alt="Active thumbnail preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                    <Upload className="w-6 h-6 mb-1 text-amber-400" />
                    <span className="text-xs font-semibold">Click to replace thumbnail</span>
                    <span className="text-[10px] text-neutral-400 mt-1">Or paste from clipboard anytime</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <Upload className="w-7 h-7 text-neutral-400 mb-2 group-hover:text-amber-400 transition-colors" />
                  <span className="text-xs font-semibold text-neutral-200">
                    Upload or Paste Thumbnail
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-1">
                    Drop image here or press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-amber-400 font-mono text-[10px]">Ctrl+V</kbd>
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

            {/* Direct URL input bar */}
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="url"
                  placeholder="Paste thumbnail image URL..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-neutral-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 h-8 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-lg text-neutral-200 transition-colors"
              >
                Load
              </button>
            </form>

            {/* Quick Sample Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-neutral-500">
                Presets:
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
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-800/80 hover:bg-amber-500/20 hover:text-amber-300 border border-neutral-700/60 text-neutral-300 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Title & Metadata Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {/* Title Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  <span>Video Title</span>
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      titleLength > 70
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : titleLength >= 30
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {titleLength} / 100 chars
                  </span>
                </div>
              </div>

              <textarea
                rows={2}
                value={activeVariant.title}
                onChange={(e) =>
                  onUpdateVariant(activeVariant.id, {
                    title: e.target.value,
                  })
                }
                placeholder="Enter an attention-grabbing YouTube video title..."
                className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-sm leading-relaxed text-white focus:outline-none focus:border-amber-400 placeholder:text-neutral-500 resize-none font-medium"
              />

              <div className="flex items-center justify-between text-xs">
                <div>
                  {titleLength <= 65 && titleLength >= 30 ? (
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Optimal length for high CTR
                    </span>
                  ) : titleLength > 65 ? (
                    <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      May truncate with &quot;...&quot; on mobile phones
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-500">
                      Recommended: 40-60 characters
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-neutral-500 mr-1">Format:</span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateVariant(activeVariant.id, {
                        title: toTitleCase(activeVariant.title),
                      })
                    }
                    className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
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
                    className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
                  >
                    ALL CAPS
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata & Channel Inline Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Channel
                </label>
                <input
                  type="text"
                  value={activeVariant.channelTitle}
                  onChange={(e) =>
                    onUpdateVariant(activeVariant.id, {
                      channelTitle: e.target.value,
                    })
                  }
                  className="w-full h-7 px-2.5 bg-neutral-850 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Views
                </label>
                <input
                  type="text"
                  value={activeVariant.viewCount}
                  onChange={(e) =>
                    onUpdateVariant(activeVariant.id, {
                      viewCount: e.target.value,
                    })
                  }
                  className="w-full h-7 px-2.5 bg-neutral-850 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Published
                </label>
                <input
                  type="text"
                  value={activeVariant.publishedTime}
                  onChange={(e) =>
                    onUpdateVariant(activeVariant.id, {
                      publishedTime: e.target.value,
                    })
                  }
                  className="w-full h-7 px-2.5 bg-neutral-850 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={activeVariant.duration}
                  onChange={(e) =>
                    onUpdateVariant(activeVariant.id, {
                      duration: e.target.value,
                    })
                  }
                  className="w-full h-7 px-2.5 bg-neutral-850 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Bottom Bar: Feed Placement & Highlighting */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-400">
                  Feed Slot:
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
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        settings.slotPosition === pos
                          ? 'bg-amber-500 text-black shadow'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
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
                    title="Random slot"
                    className="flex items-center gap-1 px-2.5 h-7 rounded-lg text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Shuffle</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-xs text-neutral-300 flex items-center gap-1.5 cursor-pointer">
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
                  <BadgeCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Verified</span>
                </label>

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
                  <span>Gold Glow</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
