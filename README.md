# 🎬 YouTube Thumbnail & Title CTR Tester

A full-fledged YouTube recommendation replica and CTR optimization lab built with Next.js 14 and Tailwind CSS. Test your video thumbnails and titles in realistic YouTube layouts against real competitor videos before publishing.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmanikumaragarwal%2Fyoutube-thumbnail-tester)

---

## ✨ Features

- **🏠 YouTube Home Feed Grid**: 3-4 column responsive grid matching YouTube desktop layout with rounded corners, channel avatars, verified checkmarks, duration badges, and hover actions.
- **📺 Watch Next (Sidebar Recommendation View)**: Exact replica of YouTube's video watch page with cinema player and the critical right-hand recommendation column where thumbnails compete for clicks.
- **🔍 YouTube Search Results View**: Wide horizontal cards with description snippets and metadata.
- **📱 Smartphone Mobile View**: iPhone 15 simulator with authentic YouTube mobile feed and navigation to test mobile crop and readability (where 70%+ of clicks happen).
- **⚖️ Side-by-Side A/B Split Testing**: Place Variant A and Variant B in identical feeds simultaneously to compare visual impact side-by-side.
- **🎯 Blind Spot Pop Test (Reaction Game)**: Shuffles your thumbnail randomly into 20 competitor videos with a millisecond stopwatch. Click your video as soon as you spot it to measure your thumbnail's visual pop!
- **👁️ Squint Test Simulator**: Adjustable blur slider (0px - 12px) to test if your thumbnail's core focal point and typography stand out when viewers skim quickly.
- **🎨 B&W Contrast Check**: 1-click grayscale toggle to verify pure luminance and tonal contrast against both YouTube Dark Mode (`#0f0f0f`) and Light Mode (`#ffffff`).
- **⚠️ Timestamp Danger Zone**: Overlay highlighting the bottom-right rectangle where YouTube stamps the duration (e.g. `14:28`) so you never place crucial text or faces underneath it.
- **⚡ Instant Image Loading**: Drag & drop, file upload, direct URL input, presets gallery, or press `Ctrl+V` anywhere to paste directly from your clipboard!
- **🌐 Real YouTube Integration**: Pulls live YouTube videos via public API mirrors and falls back to an extensive high-res curated creator catalog.

---

## 🚀 Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build

```bash
npm run build
npm start
```
