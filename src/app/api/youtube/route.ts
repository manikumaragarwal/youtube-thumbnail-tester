import { NextResponse } from 'next/server';
import { INITIAL_YOUTUBE_VIDEOS, CATEGORY_FALLBACKS } from '@/lib/mock-youtube-data';
import { YouTubeVideo } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();
  const category = searchParams.get('category')?.trim();

  // 1. If category filter is applied without search query
  if (category && category !== 'All') {
    const filtered = INITIAL_YOUTUBE_VIDEOS.filter(
      (v) => v.category.toLowerCase() === category.toLowerCase()
    );

    if (filtered.length >= 4) {
      return NextResponse.json({
        videos: filtered,
        source: 'curated-category',
      });
    }

    // Expand category with thematic high-res cards if fewer than 4 exist
    const fallbacks = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.Technology;
    const extra: YouTubeVideo[] = fallbacks.map((thumbUrl, idx) => ({
      id: `cat-${category.toLowerCase()}-${idx}`,
      title: `${category} Masterclass: What Nobody Tells You in 2026`,
      thumbnailUrl: thumbUrl,
      channelTitle: `${category} Central`,
      channelAvatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      viewCount: `${(320 + idx * 140)}K views`,
      publishedTime: `${idx + 1} days ago`,
      duration: `${12 + idx}:45`,
      verified: true,
      category: category,
      description: `Comprehensive analysis and breakthrough insights on ${category}.`,
    }));

    return NextResponse.json({
      videos: [...filtered, ...extra],
      source: 'curated-category-expanded',
    });
  }

  // 2. If search query is supplied
  if (query) {
    const lowerQ = query.toLowerCase();
    const matched = INITIAL_YOUTUBE_VIDEOS.filter(
      (v) =>
        v.title.toLowerCase().includes(lowerQ) ||
        v.channelTitle.toLowerCase().includes(lowerQ) ||
        v.category.toLowerCase().includes(lowerQ)
    );

    // Dynamic niche competitor generator so any search query produces realistic competitor cards
    const dynamicCompetitors: YouTubeVideo[] = [
      {
        id: `search-${Date.now()}-1`,
        title: `${query}: The Complete 2026 Breakdown (Avoid This Mistake)`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1280&auto=format&fit=crop&q=80',
        channelTitle: 'Tech Lead Pro',
        channelAvatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        viewCount: '890K views',
        publishedTime: '4 days ago',
        duration: '18:24',
        verified: true,
        category: 'Technology',
        description: `Everything you need to know about ${query} before starting. Honest breakdown and benchmark results.`,
      },
      {
        id: `search-${Date.now()}-2`,
        title: `I Tested 50 ${query} Projects... Here Is What Happened`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&auto=format&fit=crop&q=80',
        channelTitle: 'Creator Experiment',
        channelAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        viewCount: '1.4M views',
        publishedTime: '1 week ago',
        duration: '15:10',
        verified: true,
        category: 'Entertainment',
        description: `We spent 100 hours investigating ${query} so you don't have to waste your time.`,
      },
      {
        id: `search-${Date.now()}-3`,
        title: `The Future of ${query}: Why Everyone Is Switching`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&auto=format&fit=crop&q=80',
        channelTitle: 'Deep Dive Insider',
        channelAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        viewCount: '420K views',
        publishedTime: '2 weeks ago',
        duration: '22:40',
        verified: true,
        category: 'Science',
        description: `Analyzing industry shifts, algorithms, and key metrics regarding ${query}.`,
      },
    ];

    return NextResponse.json({
      videos: [...dynamicCompetitors, ...matched, ...INITIAL_YOUTUBE_VIDEOS],
      source: 'search-results',
    });
  }

  // 3. Default: Full verified trending catalog
  return NextResponse.json({
    videos: INITIAL_YOUTUBE_VIDEOS,
    source: 'verified-trending',
  });
}
