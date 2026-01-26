
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

type YouTubePopupContextType = {
  isYouTubePopupOpen: boolean;
  openYouTubePopup: () => void;
  closeYouTubePopup: () => void;
};

const YouTubePopupContext = createContext<YouTubePopupContextType | undefined>(undefined);

export function YouTubePopupProvider({ children }: { children: ReactNode }) {
  const [isYouTubePopupOpen, setIsYouTubePopupOpen] = useState(false);

  const openYouTubePopup = () => {
    setIsYouTubePopupOpen(true);
  };
  
  const closeYouTubePopup = () => {
    setIsYouTubePopupOpen(false);
  };

  return (
    <YouTubePopupContext.Provider value={{ isYouTubePopupOpen, openYouTubePopup, closeYouTubePopup }}>
      {children}
    </YouTubePopupContext.Provider>
  );
}

export function useYouTubePopup() {
  const context = useContext(YouTubePopupContext);
  if (context === undefined) {
    throw new Error('useYouTubePopup must be used within a YouTubePopupProvider');
  }
  return context;
}
