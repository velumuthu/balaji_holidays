
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
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { ImageUploadInput } from './image-upload-input';

const formSchema = z.object({
  imageUrl: z.string().url('Please upload an image.'),
  description: z.string().min(5, 'Description is required.'),
  imageHint: z.string().min(2, 'Image hint is required.'),
});

type ImageFormValues = z.infer<typeof formSchema>;

type GalleryImage = {
    id: string;
    imageUrl: string;
    description: string;
    imageHint: string;
}

export function ImageManager() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: images, loading } = useCollection<GalleryImage>('galleryImages');

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: '',
      description: '',
      imageHint: '',
    },
  });

  const imageUrlValue = form.watch('imageUrl');

  const onSubmit = async (data: ImageFormValues) => {
    if (!firestore) return;

    const imagesCol = collection(firestore, 'galleryImages');
    addDoc(imagesCol, data)
      .then(() => {
        toast({ title: 'Success', description: 'New image added to the gallery.' });
        form.reset({ imageUrl: '', description: '', imageHint: '' });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: imagesCol.path,
            operation: 'create',
            requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'galleryImages', id);
    deleteDoc(docRef)
      .then(() => {
        toast({
            title: 'Image Deleted',
            description: 'The image has been successfully removed from the gallery.',
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
            <CardTitle>Manage Image Gallery</CardTitle>
            <CardDescription>Add or remove photos from your public gallery page.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className='mb-8'>
                <h3 className="text-lg font-medium mb-4">Add New Image</h3>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Image Upload</FormLabel>
                            <FormControl>
                                <ImageUploadInput value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="A brief description of the image" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="imageHint"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Image Hint</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 'mountain landscape'" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={!imageUrlValue}>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Add Image
                    </Button>
                </form>
                </Form>
            </div>
            <div>
                 <h3 className="text-lg font-medium mb-4">Existing Images</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loading && Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-md" />)}
                    {images?.map(image => (
                        <div key={image.id} className="relative group">
                            <Image src={image.imageUrl} alt={image.description} width={200} height={200} className="w-full h-32 object-cover rounded-md" />
                            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md'>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(image.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {!loading && images?.length === 0 && (
                        <p className="text-muted-foreground text-sm text-center py-4 col-span-full">No images have been added yet.</p>
                    )}
                 </div>
            </div>
        </CardContent>
    </Card>

  );
}
