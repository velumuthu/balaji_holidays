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

const formSchema = z.object({
  notification1: z.string().min(10, 'Notification text is required.'),
  notification2: z.string().min(10, 'Notification text is required.'),
  notification3: z.string().min(10, 'Notification text is required.'),
});

type NotificationFormValues = z.infer<typeof formSchema>;

type SiteConfig = {
    id: string;
    notifications: string[];
}

export function NotificationManager() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: siteConfig, loading } = useDoc<SiteConfig>('siteConfig', 'notifications');

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notification1: '',
      notification2: '',
      notification3: '',
    },
  });

  useEffect(() => {
    if (siteConfig?.notifications) {
        form.setValue('notification1', siteConfig.notifications[0] || '');
        form.setValue('notification2', siteConfig.notifications[1] || '');
        form.setValue('notification3', siteConfig.notifications[2] || '');
    }
  }, [siteConfig, form]);

  const onSubmit = async (data: NotificationFormValues) => {
    if (!firestore) return;

    const configRef = doc(firestore, 'siteConfig', 'notifications');
    const notifications = { notifications: [data.notification1, data.notification2, data.notification3] };
    
    setDoc(configRef, notifications)
      .then(() => {
        toast({ title: 'Success', description: 'Notification bar text has been updated.' });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: configRef.path,
            operation: 'update',
            requestResourceData: notifications,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <Card className="mt-6">
        <CardHeader>
            <CardTitle>Manage Header Notifications</CardTitle>
            <CardDescription>Update the text for the scrolling notification bar in the header.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
                <FormField
                    control={form.control}
                    name="notification1"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Notification 1</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter first notification text" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="notification2"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Notification 2</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter second notification text" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="notification3"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Notification 3</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter third notification text" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading}>
                    <Save className="mr-2 h-4 w-4"/>
                    Save Changes
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>

  );
}
