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
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { PlusCircle, Star, Trash2, CheckCircle } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  userName: z.string().min(2, 'User name is required.'),
  content: z.string().min(10, 'Testimonial content is required.'),
  rating: z.coerce.number().min(1).max(5),
});

type TestimonialFormValues = z.infer<typeof formSchema>;

type Testimonial = {
    id: string;
    userName: string;
    content: string;
    rating: number;
    approved: boolean;
}

export function TestimonialManager() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: testimonials, loading } = useCollection<Testimonial>('testimonials');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      content: '',
      rating: 5,
    },
  });

  const onSubmit = async (data: TestimonialFormValues) => {
    if (!firestore) return;
    setIsSubmitting(true);

    const testimonialData = { ...data, approved: true };

    try {
        const testimonialsCol = collection(firestore, 'testimonials');
        addDoc(testimonialsCol, testimonialData)
        .then(() => {
            toast({ title: 'Success', description: 'New testimonial added and approved.' });
            form.reset();
        })
        .catch(async (serverError) => {
             const permissionError = new FirestorePermissionError({
                path: testimonialsCol.path,
                operation: 'create',
                requestResourceData: testimonialData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });

    } catch (error: any) {
        console.error("Error submitting testimonial:", error);
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'testimonials', id);
    const updatedData = { approved: true };

    updateDoc(docRef, updatedData)
        .then(() => {
            toast({ title: 'Testimonial Approved', description: 'The testimonial is now live on your site.' });
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'testimonials', id);
    deleteDoc(docRef)
      .then(() => {
        toast({
            title: 'Testimonial Deleted',
            description: 'The testimonial has been successfully removed.',
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

  const sortedTestimonials = testimonials?.sort((a,b) => (a.approved === b.approved) ? 0 : a.approved ? 1 : -1);

  return (
    <Card className="mt-6">
        <CardHeader>
            <CardTitle>Manage Testimonials</CardTitle>
            <CardDescription>Add, approve, or remove testimonials from your home page.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className='mb-12'>
                <h3 className="text-lg font-medium mb-4">Add New Testimonial</h3>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>User Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Testimonial Content</FormLabel>
                            <FormControl>
                                <Textarea placeholder="The trip was amazing..." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Rating</FormLabel>
                             <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a rating" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4">4 Stars</SelectItem>
                                    <SelectItem value="3">3 Stars</SelectItem>
                                    <SelectItem value="2">2 Stars</SelectItem>
                                    <SelectItem value="1">1 Star</SelectItem>
                                </SelectContent>
                                </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        {isSubmitting ? 'Adding...' : 'Add Testimonial'}
                    </Button>
                </form>
                </Form>
            </div>
            <div>
                 <h3 className="text-lg font-medium mb-4">Submitted Testimonials</h3>
                 <div className="space-y-4">
                    {loading && Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-md" />)}
                    {sortedTestimonials?.map(t => (
                        <div key={t.id} className="flex items-start justify-between gap-4 bg-muted p-4 rounded-lg">
                            <div className="flex-grow">
                                <div className='flex items-center gap-4 mb-2'>
                                    <p className='font-semibold'>{t.userName}</p>
                                    {t.approved ? (
                                        <Badge variant="secondary">Approved</Badge>
                                    ) : (
                                        <Badge variant="outline">Pending</Badge>
                                    )}
                                </div>
                                <div className="flex items-center mb-2">
                                    {Array.from({length: t.rating}).map((_, i) => (
                                        <Star key={i} className='w-4 h-4 text-primary fill-current' />
                                    ))}
                                    {Array.from({length: 5 - t.rating}).map((_, i) => (
                                        <Star key={`empty-${i}`} className='w-4 h-4 text-muted fill-muted' />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground italic">"{t.content}"</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!t.approved && (
                                    <Button size="sm" variant="outline" onClick={() => handleApprove(t.id)}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve
                                    </Button>
                                )}
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(t.id)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete Testimonial</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {!loading && testimonials?.length === 0 && (
                        <p className="text-muted-foreground text-sm text-center py-4 col-span-full">No testimonials have been submitted yet.</p>
                    )}
                 </div>
            </div>
        </CardContent>
    </Card>

  );
}
