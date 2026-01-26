
'use client';

import Image from "next/image";
import { useCollection } from "@/firebase/firestore/use-collection";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollFadeIn } from "@/components/scroll-fade-in";

type Video = {
  id: string;
  title: string;
  videoId: string;
}

type GalleryImage = {
    id: string;
    imageUrl: string;
    description: string;
    imageHint: string;
}

export default function GalleryPage() {
  const { data: galleryImages, loading: imagesLoading } = useCollection<GalleryImage>('galleryImages');
  const { data: videos, loading: videosLoading } = useCollection<Video>('videos');

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <ScrollFadeIn className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Gallery</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            A glimpse into the beautiful destinations and unforgettable moments captured on our tours.
          </p>
        </ScrollFadeIn>

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-12">
          {imagesLoading && Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-60 w-full" />)}
          {galleryImages?.map((image, index) => (
            <ScrollFadeIn key={image.id} delay={index * 0.05} className="overflow-hidden rounded-lg shadow-md break-inside-avoid">
              <Image
                src={image.imageUrl}
                alt={image.description}
                data-ai-hint={image.imageHint}
                width={600}
                height={400}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            </ScrollFadeIn>
          ))}
        </div>

        { (videosLoading || (videos && videos.length > 0)) && (
            <div className="mt-20">
                <ScrollFadeIn className="text-center">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold">Our Video Gallery</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Watch stunning visuals from the destinations we offer.
                    </p>
                </ScrollFadeIn>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {videosLoading && (
                        <>
                            <Skeleton className="w-full aspect-video rounded-lg" />
                            <Skeleton className="w-full aspect-video rounded-lg" />
                        </>
                    )}
                    {videos?.map((video, index) => (
                        <ScrollFadeIn key={video.id} delay={index * 0.1}>
                          <div className="bg-card p-4 rounded-lg shadow-md">
                              <div className="aspect-video">
                                <iframe 
                                    className="w-full h-full rounded-lg"
                                    src={`https://www.youtube.com/embed/${video.videoId}`} 
                                    title={video.title} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen>
                                </iframe>
                            </div>
                            <h3 className="mt-4 font-headline text-xl font-semibold">{video.title}</h3>
                          </div>
                        </ScrollFadeIn>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
