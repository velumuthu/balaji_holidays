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
import { doc, setDoc } from 'firebase/firestore';
import { Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useEffect } from 'react';
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
  homePageVideoUrl: z.string().url('Please enter a valid YouTube URL.'),
});

type HomeVideoFormValues = z.infer<typeof formSchema>;

type SiteConfig = {
    id: string;
    notifications: string[];
    homePageVideoId?: string;
}

export function HomeVideoManager() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: siteConfig, loading } = useDoc<SiteConfig>('siteConfig', 'notifications');

  const form = useForm<HomeVideoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homePageVideoUrl: '',
    },
  });

  useEffect(() => {
    if (siteConfig?.homePageVideoId) {
        form.setValue('homePageVideoUrl', `https://www.youtube.com/watch?v=${siteConfig.homePageVideoId}`);
    }
  }, [siteConfig, form]);

  const onSubmit = async (data: HomeVideoFormValues) => {
    if (!firestore) return;

    const videoId = getYouTubeVideoId(data.homePageVideoUrl);
     if (!videoId) {
        toast({
            variant: 'destructive',
            title: 'Invalid YouTube URL',
            description: 'Could not extract a video ID. Please check the URL and try again.',
        });
        return;
    }

    const configRef = doc(firestore, 'siteConfig', 'notifications');
    const updatedData = { homePageVideoId: videoId };
    
    setDoc(configRef, updatedData, { merge: true })
      .then(() => {
        toast({ title: 'Success', description: 'Home page video has been updated.' });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: configRef.path,
            operation: 'update',
            requestResourceData: updatedData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <Card className="mt-6">
        <CardHeader>
            <CardTitle>Manage Home Page Video</CardTitle>
            <CardDescription>Update the YouTube video displayed on your home page.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
                <FormField
                    control={form.control}
                    name="homePageVideoUrl"
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
                <Button type="submit" disabled={loading}>
                    <Save className="mr-2 h-4 w-4"/>
                    Save Video
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>

  );
}
