
import { Suspense } from 'react';
import { PackagesClient } from './packages-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function PackagesPage() {
  return (
    <Suspense fallback={<PackagesPageSkeleton />}>
      <PackagesClient />
    </Suspense>
  );
}

function PackagesPageSkeleton() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                </div>
                
                <div className="flex justify-center flex-wrap gap-2 mt-8">
                    {Array.from({length: 5}).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-24" />
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                </div>
            </div>
        </div>
    );
}
