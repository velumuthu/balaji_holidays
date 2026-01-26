'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export const FirebaseErrorListener = () => {
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // This will show the rich, contextual error in the Next.js error overlay.
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
};
