import './globals.css';
import { cn } from '@/lib/utils';
import { AppWrapper } from '@/components/app-wrapper';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/theme-provider';
import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balaji-holidays.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Balaji Holidays - Your Dream Vacation Starts Here',
    template: '%s | Balaji Holidays',
  },
  description: 'Crafting unforgettable journeys and turning travel dreams into reality. Explore our curated holiday packages for hill stations, pilgrimages, historical sites, and more.',
  keywords: ['Balaji Holidays', 'travel', 'vacation', 'holiday packages', 'India travel', 'tours', 'hill stations', 'pilgrimages', 'historical tours', 'honeymoon packages'],
  creator: 'Balaji Holidays',
  publisher: 'Balaji Holidays',
  openGraph: {
    title: 'Balaji Holidays - Your Dream Vacation Starts Here',
    description: 'Crafting unforgettable journeys with expertly curated travel packages.',
    url: siteUrl,
    siteName: 'Balaji Holidays',
    images: [
      {
        url: '/og-image.jpg', // Should be placed in the public folder
        width: 1200,
        height: 630,
        alt: 'A stunning travel destination offered by Balaji Holidays',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balaji Holidays - Your Dream Vacation Starts Here',
    description: 'Explore the world with our unique and personalized travel packages.',
    images: ['/og-image.jpg'], // Should be placed in the public folder
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppWrapper>{children}</AppWrapper>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
