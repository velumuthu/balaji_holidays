'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Firestore,
  type Query,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Query as InternalQuery } from 'firebase/firestore/lite';

export function useCollection<T>(
  path: string | null,
  options?: {
    where?: [string, '==', any];
  }
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  const memoizedPath = useMemo(() => path, [path]);
  const memoizedWhere = useMemo(() => options?.where, [options?.where]);

  const memoizedQuery = useMemo(() => {
    if (!firestore || !memoizedPath) return null;
    let q: Query = collection(firestore, memoizedPath);
    if (memoizedWhere) {
      q = query(q, where(memoizedWhere[0], memoizedWhere[1], memoizedWhere[2]));
    }
    return q;
  }, [firestore, memoizedPath, memoizedWhere]);

  useEffect(() => {
    if (!memoizedQuery) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(docs);
        setLoading(false);
      },
      (error) => {
        const path = (memoizedQuery as unknown as InternalQuery)._query.path
          .canonicalString();

        const permissionError = new FirestorePermissionError({
          operation: 'list',
          path,
        });

        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery]);

  return { data, loading };
}
