
'use client';

import { useEffect, useRef } from 'react';
import { useBookingModal } from '@/context/booking-modal-context';
import { useYouTubePopup } from '@/context/youtube-popup-context';

export function BookingPopupManager() {
  const { isOpen, openModal } = useBookingModal();
  const { openYouTubePopup } = useYouTubePopup();
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('bookingPopupShown');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        openModal();
        sessionStorage.setItem('bookingPopupShown', 'true');
      }, 3000); // Show popup after 3 seconds on first visit
      return () => clearTimeout(timer);
    }
  }, [openModal]);


  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      // Booking modal was just closed, check if we should show the YouTube popup.
      const hasSeenYouTubePopup = sessionStorage.getItem('youTubePopupShown');
      if (!hasSeenYouTubePopup) {
          const timer = setTimeout(() => {
            openYouTubePopup();
            sessionStorage.setItem('youTubePopupShown', 'true');
          }, 2000); // Show YouTube popup 2 seconds after booking modal closes

          return () => clearTimeout(timer);
      }
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, openYouTubePopup]);

  return null; // This component doesn't render anything visible
}
