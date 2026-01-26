
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Globe,
  Heart,
  Mountain,
  Palmtree,
  ShipWheel,
  Landmark,
  Star,
  Users,
  Wallet,
  Youtube,
  Eye,
  Smile,
  Briefcase,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBookingModal } from '@/context/booking-modal-context';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TestimonialsSection } from '@/components/testimonials';
import { ContactSection } from '@/components/contact-section';
import { Package } from '@/lib/packages-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { ScrollFadeIn } from '@/components/scroll-fade-in';

const packageCategories = [
  { name: 'Hill Stations', icon: Mountain, href: '/packages?category=hill-stations' },
  { name: 'Pilgrim Yatra', icon: ShipWheel, href: '/packages?category=pilgrimages' },
  { name: 'Historical', icon: Landmark, href: '/packages?category=historical' },
  { name: 'Honeymoon', icon: Heart, href: '/packages?category=honeymoon' },
];

const whyChooseUs = [
    { icon: Globe, title: "Expert Guidance", description: "Our travel experts are here to help you plan the perfect trip." },
    { icon: Wallet, title: "Best Prices", description: "We offer competitive prices and great value for your money." },
    { icon: Users, title: "Trusted by Many", description: "Thousands of happy travelers have booked with us." },
]

const impactStats = [
    { icon: Eye, end: 5000, label: "Site Visits", suffix: "+" },
    { icon: Smile, end: 500, label: "Happy Clients", suffix: "+" },
    { icon: Briefcase, end: 750, label: "Tours Organized", suffix: "+" },
    { icon: Award, end: 5, label: "Years of Excellence", suffix: "+" },
];

const useCountUp = (end: number, duration = 2000) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    useEffect(() => {
        if (inView) {
            let frame = 0;
            const counter = setInterval(() => {
                frame++;
                const progress = (frame / totalFrames);
                const currentCount = Math.round(end * progress);
                setCount(currentCount);

                if (frame === totalFrames) {
                    clearInterval(counter);
                }
            }, frameRate);
             return () => clearInterval(counter);
        }
    }, [inView, end, duration, totalFrames, frameRate]);

    return { ref, count };
};


function ImpactStat({ stat }: { stat: typeof impactStats[0] }) {
    const { ref, count } = useCountUp(stat.end);
    return (
        <div ref={ref} className="flex flex-col items-center p-4">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <stat.icon className="w-10 h-10 text-primary" />
            </div>
            <p className="text-4xl font-bold text-primary">{count.toLocaleString()}{stat.suffix}</p>
            <p className="text-muted-foreground mt-2">{stat.label}</p>
        </div>
    );
}

type SiteConfig = {
  homePageVideoId?: string;
}

export default function Home() {
  const { openModal } = useBookingModal();
  const { data: packages, loading } = useCollection<Package>('holidayPackages');
  const { data: siteConfig } = useDoc<SiteConfig>('siteConfig', 'notifications');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  const featuredPackages = packages?.slice(0, 3) || [];
  const videoId = siteConfig?.homePageVideoId || 'dQw4w9WgXcQ';

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
        >
          <source src="/videos/nature_background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
            <ScrollFadeIn>
              <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Explore the World with Balaji Holidays
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-center text-lg md:text-xl">
                Unforgettable journeys, curated just for you. Let us turn your travel dreams into reality.
              </p>
              <Button size="lg" className="mt-8" onClick={() => openModal()}>
                Book Your Dream Vacay Today! <ArrowRight className="ml-2" />
              </Button>
            </ScrollFadeIn>
        </div>
      </section>

      {/* Trusted Partner Section */}
        <section className="py-16 bg-background">
          <ScrollFadeIn className="container mx-auto px-4">
            <h2 className="font-headline text-3xl font-semibold text-center">Our Trusted Partners</h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-muted-foreground">
                We collaborate with the best in the industry to ensure you have a seamless and high-quality travel experience.
            </p>
            <div className="mt-10 w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-marquee-partners">
                    <li className="flex justify-center items-center h-20 w-48 bg-muted rounded-lg p-4 grayscale hover:grayscale-0 transition-all">
                        <a href="tel:9043291950" className="text-muted-foreground font-semibold text-xl text-center">Eden Holidays</a>
                    </li>
                    <li className="flex justify-center items-center h-20 w-48 bg-muted rounded-lg p-4 grayscale hover:grayscale-0 transition-all">
                          <a href="tel:7569310952" className="text-muted-foreground font-semibold text-xl text-center">Kantara Holidays</a>
                    </li>
                    <li className="flex justify-center items-center h-20 w-48 bg-muted rounded-lg p-4 grayscale hover:grayscale-0 transition-all">
                        <a href="https://api.whatsapp.com/send?phone=919048719279" target="_blank" rel="noopener noreferrer" className="text-muted-foreground font-semibold text-xl text-center">mahfks</a>
                    </li>
                    <li className="flex justify-center items-center h-20 w-48 bg-muted rounded-lg p-4 grayscale hover:grayscale-0 transition-all">
                        <a href="tel:8428250041" className="flex text-center justify-center items-center text-muted-foreground font-semibold text-xl">Dream Destination (Pondicherry)</a>
                    </li>
                </ul>
                  <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-marquee-partners" aria-hidden="true">
                    <li className="flex justify-center items-center h-20 w-48 bg-muted rounded-lg p-4 grayscale hover:grayscale-0 transition-all">
                        <a href="tel:9043291950" className="text-muted-foreground font-semibold text-xl text-center">Eden Holidays</a>
                    </li>
                    <li className="flex justify-center items-center h-20 w-48 bg-muted rounded-lg p-4 grayscale hover:grayscale-0 transition-all">
                          <a href="tel:7569310952" className="text-muted-foreground font-semibold text-xl text-center">Kantara Holidays</a>
                    </li>
                    <li className="flex justify-center items-center h-20 w-48 bg-muted rounded-lg p-4 grayscale hover:grayscale-0 transition-all">
                        <a href="https://api.whatsapp.com/send?phone=919048719279" target="_blank" rel="noopener noreferrer" className="text-muted-foreground font-semibold text-xl text-center">mahfks</a>
                    </li>
                    <li className="flex justify-center items-center h-20 w-48 bg-muted rounded-lg p-4 grayscale hover:grayscale-0 transition-all">
                        <a href="tel:8428250041" className="flex text-center justify-center items-center text-muted-foreground font-semibold text-xl">Dream Destination (Pondicherry)</a>
                    </li>
                </ul>
            </div>
          </ScrollFadeIn>
        </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {packageCategories.map((category, index) => (
              <ScrollFadeIn key={category.name} delay={index * 0.1}>
                <Link href={category.href}>
                    <div className="group flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                    <category.icon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                    <h3 className="mt-4 font-headline text-lg font-semibold text-center">{category.name}</h3>
                    </div>
                </Link>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
            <ScrollFadeIn>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">Featured Packages</h2>
              <p className="mt-4 text-center text-muted-foreground max-w-3xl mx-auto">
                Get inspired by our most popular travel packages, offering the perfect blend of adventure and relaxation.
              </p>
            </ScrollFadeIn>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading && Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
              {featuredPackages?.map((pkg, index) => {
                return (
                  <ScrollFadeIn key={pkg.id} delay={index * 0.1}>
                    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full">
                        <CardHeader className="p-0">
                        <div className="relative h-60 w-full">
                            <Image
                                src={pkg.image}
                                alt={pkg.name}
                                fill
                                className="object-cover"
                            />
                            <Badge variant="destructive" className="absolute top-4 right-4">{pkg.duration}</Badge>
                        </div>
                        </CardHeader>
                        <CardContent className="flex-grow p-6">
                        <CardTitle className="font-headline text-2xl">{pkg.name}</CardTitle>
                        <p className="mt-2 text-muted-foreground line-clamp-3">{pkg.description}</p>
                        </CardContent>
                        <CardFooter className="p-6 pt-0 flex justify-between items-center">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < pkg.rating ? 'text-primary fill-current' : 'text-muted'}`} />
                            ))}
                        </div>
                        <Button asChild>
                            <Link href={`/packages/${pkg.slug}`}>View Details <ArrowRight className="ml-2" /></Link>
                        </Button>
                        </CardFooter>
                    </Card>
                  </ScrollFadeIn>
                );
              })}
            </div>
           <div className="text-center mt-12">
            <ScrollFadeIn>
                <Button asChild variant="outline" size="lg">
                    <Link href="/packages">View All Packages</Link>
                </Button>
            </ScrollFadeIn>
            </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-muted/50">
          <div className="container mx-auto px-4">
              <ScrollFadeIn>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">Why Choose Balaji Holidays?</h2>
                <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
                    We are dedicated to providing the best travel experiences, tailored to your needs. Here are a few reasons why travelers choose us.
                </p>
              </ScrollFadeIn>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {whyChooseUs.map((item, index) => (
                      <ScrollFadeIn key={index} delay={index * 0.1}>
                        <div className="p-6">
                            <div className="inline-block p-4 bg-primary/10 rounded-full">
                                <item.icon className="w-10 h-10 text-primary"/>
                            </div>
                            <h3 className="mt-6 font-headline text-xl font-semibold">{item.title}</h3>
                            <p className="mt-2 text-muted-foreground">{item.description}</p>
                        </div>
                      </ScrollFadeIn>
                  ))}
              </div>
          </div>
      </section>
       
      {/* Our Impact Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
            <ScrollFadeIn>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">Our Impact</h2>
                <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
                    We are proud of the smiles we've created and the journeys we've enabled. Here's a look at our story in numbers.
                </p>
            </ScrollFadeIn>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {impactStats.map((stat, index) => (
                   <ScrollFadeIn key={index} delay={index * 0.1}>
                        <ImpactStat stat={stat} />
                   </ScrollFadeIn>
                ))}
            </div>
        </div>
      </section>
      {/* Testimonials Section */}
      {isClient && <TestimonialsSection />}

      {/* Contact Section */}
      {isClient && <ContactSection />}

    </div>
  );
}
