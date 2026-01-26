
'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  doc,
  onSnapshot,
  type DocumentReference,
  type Firestore,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useDoc<T>(path: string, docId: string): { data: T | null, loading: boolean };
export function useDoc<T>(docRef: DocumentReference<T> | null): { data: T | null, loading: boolean };
export function useDoc<T>(
  pathOrDocRef: string | DocumentReference<T> | null,
  docId?: string
): { data: T | null; loading: boolean } {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const memoizedDocRef = useMemo(() => {
    if (pathOrDocRef === null) return null;
    if (typeof pathOrDocRef === 'string') {
      if (!firestore || !docId) return null;
      return doc(firestore, pathOrDocRef, docId) as DocumentReference<T>;
    }
    return pathOrDocRef;
  }, [pathOrDocRef, docId, firestore]);

  useEffect(() => {
    if (!memoizedDocRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]);

  return { data, loading };
}
