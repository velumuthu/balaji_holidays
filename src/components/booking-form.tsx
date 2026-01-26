
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
import { Send } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().regex(phoneRegex, 'Invalid phone number').min(10, { message: 'Phone number must be at least 10 digits.' }),
  whatsapp: z.string().regex(phoneRegex, 'Invalid WhatsApp number').min(10, { message: 'WhatsApp number must be at least 10 digits.' }),
  travelDate: z.string().min(1, { message: 'Date of travel is required.' }),
  people: z.coerce.number().min(1, { message: 'At least one person must travel.' }),
  vacationType: z.string().min(1, { message: 'Please select a vacation type.' }),
  destination: z.string().optional(),
  captcha: z.string().min(1, { message: 'Please solve the captcha.' }),
});

export function BookingForm({ defaultDestination }: { defaultDestination?: string }) {
  const { toast } = useToast();
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      city: '',
      email: '',
      phone: '',
      whatsapp: '',
      travelDate: '',
      people: 1,
      vacationType: '',
      destination: defaultDestination || '',
      captcha: '',
    },
  });

  useEffect(() => {
    // Reset destination when defaultDestination changes
    form.setValue('destination', defaultDestination || '');
  }, [defaultDestination, form]);

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (parseInt(values.captcha) !== num1 + num2) {
      form.setError('captcha', {
        type: 'manual',
        message: 'Incorrect answer. Please try again.',
      });
      return;
    }

    const adminPhoneNumber = '918695172090';
    const message = `
*New Holiday Booking Inquiry*

*Package/Destination:* ${values.destination || "Not specified"}
*Name:* ${values.name}
*City:* ${values.city}
*Email:* ${values.email}
*Phone:* +91${values.phone}
*WhatsApp:* +91${values.whatsapp}
*Travel Date:* ${values.travelDate}
*No. of People:* ${values.people}
*Vacation Type:* ${values.vacationType}
    `.trim().replace(/\n\s*\n/g, '\n');

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${adminPhoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    
    toast({
      title: 'Redirecting to WhatsApp...',
      description: "Your booking inquiry has been prepared. Please send the message in WhatsApp.",
    });
    form.reset({
        name: '',
        city: '',
        email: '',
        phone: '',
        whatsapp: '',
        travelDate: '',
        people: 1,
        vacationType: '',
        destination: defaultDestination || '',
        captcha: '',
    });
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City of Residence *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mumbai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                    <div className="flex items-center">
                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                            +91
                        </span>
                        <Input type="tel" placeholder="9876543210" className="rounded-l-none" {...field} />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp *</FormLabel>
                <FormControl>
                    <div className="flex items-center">
                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                            +91
                        </span>
                        <Input type="tel" placeholder="9876543210" className="rounded-l-none" {...field} />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="travelDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Travel *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 25/12/2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Destination</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Shimla, Manali" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="people"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of People *</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="e.g., 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="vacationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vacation Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vacation type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Honeymoon">Honeymoon</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Friends">Friends</SelectItem>
                    <SelectItem value="Solo">Solo</SelectItem>
                    <SelectItem value="Religious">Religious</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="captcha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Captcha *</FormLabel>
                <div className="flex items-center gap-2">
                   <span className="p-2 bg-muted rounded-md text-sm">{num1} + {num2} =</span>
                    <FormControl>
                        <Input type="number" placeholder="?" {...field} />
                    </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" size="lg">
          Submit <Send className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
