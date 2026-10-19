import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YouTube Thumbnail & Title Tester | CTR & Standout Lab',
  description:
    'Test your YouTube video thumbnails and titles directly in authentic YouTube feeds, Watch Next sidebar recommendations, and mobile previews to ensure maximum visual pop and CTR.',
  keywords: [
    'YouTube thumbnail tester',
    'YouTube title preview',
    'CTR optimizer',
    'YouTube layout replica',
    'thumbnail A/B testing',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
