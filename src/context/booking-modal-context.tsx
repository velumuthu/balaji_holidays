'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

type BookingModalContextType = {
  isOpen: boolean;
  openModal: (destination?: string) => void;
  closeModal: () => void;
  defaultDestination?: string;
};

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultDestination, setDefaultDestination] = useState<string | undefined>();

  const openModal = (destination?: string) => {
    if (destination) {
        setDefaultDestination(destination);
    } else {
        setDefaultDestination(undefined);
    }
    setIsOpen(true);
  };
  
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <BookingModalContext.Provider value={{ isOpen, openModal, closeModal, defaultDestination }}>
      {children}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(BookingModalContext);
  if (context === undefined) {
    throw new Error('useBookingModal must be used within a BookingModalProvider');
  }
  return context;
}
