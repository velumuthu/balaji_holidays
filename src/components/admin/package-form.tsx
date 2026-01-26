
'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Package } from '@/lib/packages-data';
import { useFirestore } from '@/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { PlusCircle, Trash2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { ImageUploadInput } from './image-upload-input';
import { useEffect, useState } from 'react';

const itineraryItemSchema = z.object({
  day: z.coerce.number().min(1),
  title: z.string().min(3, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
});

const isBase64Image = (val: unknown) => typeof val === 'string' && (val.startsWith('data:image/') || val.startsWith('https://'));


const formSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  slug: z.string().min(2, 'Slug is required. Use format: "my-package-slug"'),
  category: z.enum(['hill-stations', 'pilgrimages', 'historical', 'honeymoon']),
  duration: z.string().min(3, 'Duration is required.'),
  description: z.string().min(10, 'Description is required.'),
  rating: z.coerce.number().min(1).max(5),
  image: z.string().refine(isBase64Image, { message: 'Please upload a main image.' }),
  gallery: z.array(z.string().refine(isBase64Image, { message: 'Each gallery item must be a valid image upload.' })).min(1, 'Please upload at least one gallery image.'),
  itinerary: z.array(itineraryItemSchema).min(1, 'At least one itinerary day is required.'),
  virtualTourUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

export type PackageFormValues = z.infer<typeof formSchema>;

interface PackageFormProps {
  packageData?: Package;
  setDialogOpen: (open: boolean) => void;
}

export function PackageForm({ packageData, setDialogOpen }: PackageFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: packageData
      ? {
          ...packageData,
          itinerary: packageData.itinerary || [],
          virtualTourUrl: packageData.virtualTourUrl || '',
        }
      : {
          name: '',
          slug: '',
          category: 'hill-stations',
          duration: '',
          description: '',
          rating: 4,
          image: '',
          gallery: [''],
          itinerary: [{ day: 1, title: '', description: '' }],
          virtualTourUrl: '',
        },
  });

  useEffect(() => {
    form.reset(
        packageData
        ? {
            ...packageData,
            itinerary: packageData.itinerary || [],
            virtualTourUrl: packageData.virtualTourUrl || '',
            gallery: packageData.gallery.length > 0 ? packageData.gallery : ['']
            }
        : {
            name: '',
            slug: '',
            category: 'hill-stations',
            duration: '',
            description: '',
            rating: 4,
            image: '',
            gallery: [''],
            itinerary: [{ day: 1, title: '', description: '' }],
            virtualTourUrl: '',
        }
    );
  }, [packageData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'itinerary',
  });
  
  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control: form.control,
    name: 'gallery'
  });

  const onSubmit = async (data: PackageFormValues) => {
    if (!firestore) return;
    setIsSubmitting(true);
    
    const finalData = {
        ...data,
        gallery: data.gallery.filter(url => url && (url.startsWith('data:image/') || url.startsWith('https://'))),
    };

    if (finalData.gallery.length === 0) {
        form.setError('gallery', { type: 'manual', message: 'Please upload at least one gallery image.' });
        setIsSubmitting(false);
        return;
    }

    try {
        if (packageData) {
            // Update existing package
            const packageRef = doc(firestore, 'holidayPackages', packageData.id);
            await updateDoc(packageRef, finalData);
            toast({ title: 'Success', description: 'Package updated successfully.' });
        } else {
            // Add new package
            const packagesCol = collection(firestore, 'holidayPackages');
            await addDoc(packagesCol, finalData);
            toast({ title: 'Success', description: 'New package added successfully.' });
        }
        setDialogOpen(false);
    } catch (serverError: any) {
        const operation = packageData ? 'update' : 'create';
        const path = packageData ? doc(firestore, 'holidayPackages', packageData.id).path : collection(firestore, 'holidayPackages').path;
        
        const permissionError = new FirestorePermissionError({
            path: path,
            operation: operation as 'update' | 'create',
            requestResourceData: finalData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Enchanting Shimla & Manali" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., enchanting-shimla-manali" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Detailed description of the package." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hill-stations">Hill Stations</SelectItem>
                    <SelectItem value="pilgrimages">Pilgrimages</SelectItem>
                    <SelectItem value="historical">Historical</SelectItem>
                    <SelectItem value="honeymoon">Honeymoon</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 6 Days / 5 Nights" {...field} />
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
                <FormLabel>Rating (1-5)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="virtualTourUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Virtual Tour URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://www.google.com/maps/embed?pb=..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-6">
            <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Main Image</FormLabel>
                    <FormControl>
                    <ImageUploadInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div>
                <FormLabel>Gallery Images</FormLabel>
                <div className="space-y-4 mt-2">
                    {galleryFields.map((field, index) => (
                        <FormField
                            key={field.id}
                            control={form.control}
                            name={`gallery.${index}`}
                            render={({ field: itemField }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <ImageUploadInput value={itemField.value} onChange={itemField.onChange} />
                                        </FormControl>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeGallery(index)} disabled={galleryFields.length <= 1}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => appendGallery('')} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Gallery Image
                </Button>
            </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Itinerary</h3>
          <div className="space-y-6">
            {fields.map((item, index) => (
              <div key={item.id} className="space-y-4 p-4 border rounded-md relative">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)} disabled={fields.length <=1}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                    control={form.control}
                    name={`itinerary.${index}.day`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Day</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`itinerary.${index}.title`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Arrival in Shimla" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                control={form.control}
                name={`itinerary.${index}.description`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea rows={3} placeholder="Describe the day's activities" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ day: fields.length + 1, title: '', description: '' })} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Day
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (packageData ? 'Update Package' : 'Create Package')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
