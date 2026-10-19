import { NextResponse } from 'next/server';
import { INITIAL_YOUTUBE_VIDEOS } from '@/lib/mock-youtube-data';
import { YouTubeVideo } from '@/types';

// Invidious public instances that provide public YouTube search without API keys
const INVIDIOUS_INSTANCES = [
  'https://inv.tux.pizza',
  'https://invidious.nerdvpn.de',
  'https://yt.artemislena.eu',
  'https://invidious.projectsegfau.lt',
];

interface InvidiousSearchItem {
  type?: string;
  videoId?: string;
  title?: string;
  author?: string;
  authorThumbnails?: { url: string }[];
  viewCount?: number;
  publishedText?: string;
  lengthSeconds?: number;
  description?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();
  const category = searchParams.get('category')?.trim();

  // If no specific query is provided, return category-filtered mock list
  if (!query) {
    if (category && category !== 'All') {
      const filtered = INITIAL_YOUTUBE_VIDEOS.filter(
        (v) => v.category.toLowerCase() === category.toLowerCase()
      );
      return NextResponse.json({
        videos: filtered.length > 0 ? filtered : INITIAL_YOUTUBE_VIDEOS,
        source: 'curated-category',
      });
    }
    return NextResponse.json({
      videos: INITIAL_YOUTUBE_VIDEOS,
      source: 'curated-trending',
    });
  }

  // If a search query is given, attempt to fetch live videos from YouTube via public mirrors
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    for (const instance of INVIDIOUS_INSTANCES) {
      try {
        const response = await fetch(
          `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (response.ok) {
          clearTimeout(timeoutId);
          const data = (await response.json()) as InvidiousSearchItem[];
          if (Array.isArray(data) && data.length > 0) {
            const parsedVideos: YouTubeVideo[] = data
              .filter((item) => item.type === 'video' && item.videoId)
              .slice(0, 24)
              .map((item) => ({
                id: item.videoId!,
                title: item.title || 'Untitled Video',
                thumbnailUrl: `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
                channelTitle: item.author || 'Creator',
                channelAvatarUrl:
                  item.authorThumbnails?.[0]?.url ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                    item.author || 'yt'
                  )}`,
                viewCount: item.viewCount
                  ? item.viewCount > 1000000
                    ? `${(item.viewCount / 1000000).toFixed(1)}M views`
                    : item.viewCount > 1000
                    ? `${(item.viewCount / 1000).toFixed(0)}K views`
                    : `${item.viewCount} views`
                  : '120K views',
                publishedTime: item.publishedText || 'Recently',
                duration: item.lengthSeconds
                  ? `${Math.floor(item.lengthSeconds / 60)}:${String(
                      item.lengthSeconds % 60
                    ).padStart(2, '0')}`
                  : '10:15',
                verified: true,
                category: category || 'Technology',
                description: item.description || '',
              }));

            return NextResponse.json({
              videos: parsedVideos,
              source: 'live-youtube',
            });
          }
        }
      } catch {
        // Try next instance
      }
    }
  } catch {
    // Fallback below
  }

  // Graceful fallback: Filter curated videos or synthesize realistic matching results
  const lowerQ = query.toLowerCase();
  const matched = INITIAL_YOUTUBE_VIDEOS.filter(
    (v) =>
      v.title.toLowerCase().includes(lowerQ) ||
      v.channelTitle.toLowerCase().includes(lowerQ) ||
      v.category.toLowerCase().includes(lowerQ)
  );

  if (matched.length >= 3) {
    return NextResponse.json({
      videos: matched,
      source: 'local-search',
    });
  }

  // If few matches, return full curated list with query-targeted mock items at top
  const synthesized: YouTubeVideo[] = [
    {
      id: `mock-${Date.now()}-1`,
      title: `${query}: The Complete 2026 Guide You Need To Watch`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1280&auto=format&fit=crop&q=80',
      channelTitle: 'Deep Dive Tech',
      channelAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      viewCount: '450K views',
      publishedTime: '3 days ago',
      duration: '18:22',
      verified: true,
      category: 'Technology',
      description: `Comprehensive walkthrough and review of ${query}.`,
    },
    {
      id: `mock-${Date.now()}-2`,
      title: `Why Everyone Is Wrong About ${query} (Truth Exposed)`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1280&auto=format&fit=crop&q=80',
      channelTitle: 'Insider Analysis',
      channelAvatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      viewCount: '890K views',
      publishedTime: '1 week ago',
      duration: '14:45',
      verified: true,
      category: 'Education',
      description: `Analyzing the latest data, trends, and breakthroughs regarding ${query}.`,
    },
    ...INITIAL_YOUTUBE_VIDEOS,
  ];

  return NextResponse.json({
    videos: synthesized,
    source: 'synthesized-fallback',
  });
}
