'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Star, PlusCircle } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

type Testimonial = {
    id: string;
    rating: number;
    content: string;
    userName: string;
    approved: boolean;
}

const formSchema = z.object({
  userName: z.string().min(2, 'User name is required.'),
  content: z.string().min(10, 'Testimonial content is required.'),
  rating: z.coerce.number().min(1).max(5),
});

type TestimonialFormValues = z.infer<typeof formSchema>;


function PublicTestimonialForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const firestore = useFirestore();

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
        
        const testimonialData = { ...data, approved: false };

        try {
            const testimonialsCol = collection(firestore, 'testimonials');
            addDoc(testimonialsCol, testimonialData)
                .then(() => {
                    toast({ title: 'Thank You!', description: 'Your testimonial has been submitted for approval.' });
                    form.reset();
                })
                .catch(async (serverError) => {
                     const permissionError = new FirestorePermissionError({
                        path: testimonialsCol.path,
                        operation: 'create',
                        requestResourceData: data,
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


    return (
        <Card className="mt-12" id="testimonial-form">
            <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
                <CardDescription>We&apos;d love to hear about your trip with Balaji Holidays!</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., John D." {...field} />
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
                            <FormLabel>Your Testimonial</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Share your feedback with us..." {...field} />
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
                            <FormLabel>Your Rating</FormLabel>
                             <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a rating" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="5">5 Stars - Excellent</SelectItem>
                                    <SelectItem value="4">4 Stars - Very Good</SelectItem>
                                    <SelectItem value="3">3 Stars - Good</SelectItem>
                                    <SelectItem value="2">2 Stars - Fair</SelectItem>
                                    <SelectItem value="1">1 Star - Poor</SelectItem>
                                </SelectContent>
                                </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export function TestimonialsSection() {
    const { data: testimonials, loading } = useCollection<Testimonial>('testimonials', { where: ['approved', '==', true] });

  return (
    <section className="py-16 bg-muted/50" id="testimonials">
      <div className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">
          What Our Clients Say
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-3xl mx-auto">
          Honest feedback from our valued travelers who experienced the world with us.
        </p>

        {(loading || (testimonials && testimonials.length > 0)) && (
            <Carousel
                opts={{ align: 'start', loop: (testimonials?.length || 0) > 2 }}
                className="w-full max-w-6xl mx-auto mt-12"
                >
                <CarouselContent className="-ml-4">
                    {loading && Array.from({ length: 3 }).map((_, i) => (
                        <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 pl-4">
                            <div className="p-1 h-full">
                            <Skeleton className="h-64 w-full" />
                            </div>
                        </CarouselItem>
                    ))}
                    {testimonials?.map((testimonial) => {
                        return (
                            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                                <div className="p-1 h-full">
                                <Card className="h-full flex flex-col">
                                    <CardContent className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center mb-4">
                                            {Array(testimonial.rating)
                                            .fill(0)
                                            .map((_, i) => (
                                                <Star
                                                key={i}
                                                className='w-5 h-5 text-primary fill-current'
                                                />
                                            ))}
                                            {Array(5 - testimonial.rating)
                                            .fill(0)
                                            .map((_, i) => (
                                                <Star
                                                key={`empty-${i}`}
                                                className='w-5 h-5 text-muted-foreground/30'
                                                />
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                                    </div>
                                    <div className="mt-6">
                                        <p className="font-semibold">{testimonial.userName}</p>
                                    </div>
                                    </CardContent>
                                </Card>
                                </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        )}
        
        <PublicTestimonialForm />
      </div>
    </section>
  );
}
