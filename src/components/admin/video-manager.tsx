'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

const getYouTubeVideoId = (url: string) => {
    let videoId = '';
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([\w-]{11})(?:\S+)?/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
        videoId = match[1];
    }
    return videoId;
};

const formSchema = z.object({
  title: z.string().min(2, 'Title is required.'),
  videoUrl: z.string().url('Please enter a valid YouTube URL.').min(5, 'A valid YouTube URL is required.'),
});

type VideoFormValues = z.infer<typeof formSchema>;

type Video = {
    id: string;
    title: string;
    videoId: string;
}

export function VideoManager() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: videos, loading } = useCollection<Video>('videos');

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      videoUrl: '',
    },
  });

  const onSubmit = async (data: VideoFormValues) => {
    if (!firestore) return;

    const videoId = getYouTubeVideoId(data.videoUrl);
    if (!videoId) {
        toast({
            variant: 'destructive',
            title: 'Invalid YouTube URL',
            description: 'Could not extract a video ID. Please check the URL and try again.',
        });
        return;
    }
    
    const videoData = { title: data.title, videoId };

    const videosCol = collection(firestore, 'videos');
    addDoc(videosCol, videoData)
      .then(() => {
        toast({ title: 'Success', description: 'New video added successfully.' });
        form.reset();
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: videosCol.path,
            operation: 'create',
            requestResourceData: videoData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'videos', id);
    deleteDoc(docRef)
      .then(() => {
        toast({
            title: 'Video Deleted',
            description: 'The video has been successfully removed from the gallery.',
        });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };


  return (
    <Card className="mt-6">
        <CardHeader>
            <CardTitle>Manage Video Gallery</CardTitle>
            <CardDescription>Add or remove YouTube videos from your public gallery page.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-medium mb-4">Add New Video</h3>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Video Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., A Trip to the Mountains" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>YouTube Video URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Add Video
                    </Button>
                </form>
                </Form>
            </div>
            <div>
                 <h3 className="text-lg font-medium mb-4">Existing Videos</h3>
                 <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {loading && (
                        <>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </>
                    )}
                    {videos?.map(video => (
                        <div key={video.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <div>
                                <p className="font-semibold">{video.title}</p>
                                <p className="text-sm text-muted-foreground">ID: {video.videoId}</p>
                            </div>
                            <Button variant="destructive" size="icon" onClick={() => handleDelete(video.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {!loading && videos?.length === 0 && (
                        <p className="text-muted-foreground text-sm text-center py-4">No videos have been added yet.</p>
                    )}
                 </div>
            </div>
        </CardContent>
    </Card>

  );
}
