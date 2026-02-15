
'use client';

import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BookingModalProvider } from '@/context/booking-modal-context';
import { BookingModal } from '@/components/booking-modal';
import Link from 'next/link';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { BookingPopupManager } from '@/components/booking-popup-manager';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { YouTubePopupProvider } from '@/context/youtube-popup-context';
import { YouTubePopup } from './youtube-popup';
import { onMessageListener, requestPermission } from '@/firebase/messaging';
import { useToast } from '@/hooks/use-toast';
import { ClientOnly } from './client-only';

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function AppWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(function (registration) {
          console.log('Registration successful, scope is:', registration.scope);
          requestPermission();
        })
        .catch(function (err) {
          console.log('Service worker registration failed, error:', err);
        });
    }
  }, []);
  
  useEffect(() => {
    onMessageListener().then((payload: any) => {
        toast({
            title: payload?.notification?.title,
            description: payload?.notification?.body,
        });
    });
  }, [toast]);


  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <FirebaseClientProvider>
      <BookingModalProvider>
        <YouTubePopupProvider>
          <BookingPopupManager />
          <div className="relative flex min-h-screen flex-col z-10">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <BookingModal />
          <YouTubePopup />
        </YouTubePopupProvider>
      </BookingModalProvider>
      <Link
        href="https://api.whatsapp.com/send?phone=918695172090"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </Link>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full shadow-lg"
          size="icon"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </FirebaseClientProvider>
  );
}
