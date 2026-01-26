
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormEvent } from "react";


export function ContactSection() {
    const { toast } = useToast();
    
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        const mailtoLink = `mailto:velumuthu.cse@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

        window.location.href = mailtoLink;
        
        toast({
            title: "Email Client Opening...",
            description: "Please send the email from your mail application.",
        });
    };


  return (
    <section className="py-16 bg-background" id="contact">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Get In Touch</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Have a question or ready to plan your next adventure? Contact us today!
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Email Us</h3>
                <a href="mailto:velumuthu.cse@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">velumuthu.cse@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Call Us</h3>
                <div className="flex flex-col">
                    <a href="tel:8695172090" className="text-muted-foreground hover:text-primary transition-colors">8695172090</a>
                    <a href="tel:9787178910" className="text-muted-foreground hover:text-primary transition-colors">9787178910</a>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold font-headline mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" name="name" placeholder="Your Name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" name="email" placeholder="Your Email" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" type="text" name="subject" placeholder="Subject of your message" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" placeholder="Write your message here..." rows={5} required />
                </div>
                <Button type="submit" className="w-full" size="lg">
                    Send Message <Send className="ml-2 h-4 w-4" />
                </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
