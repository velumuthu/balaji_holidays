
'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1 lg:col-span-1">
            <div className="cursor-pointer mb-4 inline-block font-headline font-bold text-xl">
              <div><span className="text-yellow-500">Balaji</span> Holidays</div>
            </div>
            <p className="text-muted-foreground text-sm">
              Crafting unforgettable travel experiences. Your dream vacation is our mission.
            </p>
            <div className="flex space-x-4 mt-6">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Youtube /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 col-span-1 md:col-span-1 lg:col-span-3 sm:grid-cols-3">
              <div>
                <h4 className="font-headline font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                  <li><Link href="/packages" className="text-muted-foreground hover:text-primary">Packages</Link></li>
                  <li><Link href="/gallery" className="text-muted-foreground hover:text-primary">Gallery</Link></li>
                  <li><Link href="/#testimonial-form" className="text-muted-foreground hover:text-primary">Leave a Testimonial</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-headline font-semibold mb-4">Vacation Types</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/packages?category=hill-stations" className="text-muted-foreground hover:text-primary">Hill Stations</Link></li>
                  <li><Link href="/packages?category=pilgrimages" className="text-muted-foreground hover:text-primary">Pilgrim Yatra</Link></li>
                  <li><Link href="/packages?category=historical" className="text-muted-foreground hover:text-primary">Historical Tours</Link></li>
                  <li><Link href="/packages?category=honeymoon" className="text-muted-foreground hover:text-primary">Honeymoon</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-headline font-semibold mb-4">Contact Info</h4>
                <address className="not-italic text-sm text-muted-foreground space-y-2">
                  <p>Email: <a href="mailto:velumuthu.cse@gmail.com" className="hover:text-primary">velumuthu.cse@gmail.com</a></p>
                  <p>Phone: <a href="tel:8695172090" className="hover:text-primary">8695172090</a> / <a href="tel:9787178910" className="hover:text-primary">9787178910</a></p>
                </address>
              </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground sm:flex sm:justify-between sm:items-center">
          <p>&copy; {new Date().getFullYear()} Balaji Holidays. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-4 sm:mt-0">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

    