
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Package } from '@/lib/packages-data';
import { DataTable } from './data-table';
import { columns } from './columns';
import { PlusCircle } from 'lucide-react';
import { PackageDialog } from '@/components/admin/package-dialog';
import { VideoManager } from '@/components/admin/video-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageManager } from '@/components/admin/image-manager';
import { NotificationManager } from '@/components/admin/notification-manager';
import { HomeVideoManager } from '@/components/admin/home-video-manager';
import { TestimonialManager } from '@/components/admin/testimonial-manager';
import { FcmTokenManager } from '@/components/admin/fcm-token-manager';

export default function AdminDashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { data: packages, loading: packagesLoading } = useCollection<Package>('holidayPackages');
  const [isNewPackageOpen, setIsNewPackageOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your holiday packages and site content.</p>
        </div>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="images">Image Gallery</TabsTrigger>
          <TabsTrigger value="videos">Video Gallery</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="homepage">Home Page</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="push">Push Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="packages">
            <div className="flex justify-end items-center my-4">
                 <PackageDialog isOpen={isNewPackageOpen} setIsOpen={setIsNewPackageOpen}>
                    <Button onClick={() => setIsNewPackageOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Package
                    </Button>
                </PackageDialog>
            </div>
            <DataTable columns={columns} data={packages || []} loading={packagesLoading} />
        </TabsContent>
        <TabsContent value="images">
            <ImageManager />
        </TabsContent>
        <TabsContent value="videos">
            <VideoManager />
        </TabsContent>
        <TabsContent value="notifications">
            <NotificationManager />
        </TabsContent>
        <TabsContent value="homepage">
            <HomeVideoManager />
        </TabsContent>
        <TabsContent value="testimonials">
            <TestimonialManager />
        </TabsContent>
        <TabsContent value="push">
            <FcmTokenManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
