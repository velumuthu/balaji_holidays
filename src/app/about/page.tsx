
'use client';

import Image from "next/image";
import { Globe, Heart, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollFadeIn } from "@/components/scroll-fade-in";

export default function AboutPage() {
  const [clickCount, setClickCount] = useState(0);
  const router = useRouter();

  const handleImageClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 6) {
      router.push('/admin/dashboard');
    }
  };


  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <ScrollFadeIn className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">About Balaji Holidays</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Crafting unforgettable journeys and turning travel dreams into reality.
          </p>
        </ScrollFadeIn>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <ScrollFadeIn>
            <h2 className="font-headline text-3xl font-semibold">Our Story</h2>
            <p className="mt-4 text-muted-foreground">
              Founded on a passion for exploration and a commitment to service, Balaji Holidays started as a small venture with a big dream: to make travel accessible, enjoyable, and enriching for everyone. Over the years, we've grown into a trusted name in the industry, known for our personalized itineraries, expert guidance, and unwavering dedication to our clients.
            </p>
            <p className="mt-4 text-muted-foreground">
              We believe that travel is more than just visiting new places; it's about creating lasting memories, experiencing new cultures, and discovering yourself along the way. Our team of seasoned travel experts works tirelessly to design unique and seamless travel experiences that go beyond the ordinary.
            </p>
          </ScrollFadeIn>
          <ScrollFadeIn className="flex justify-center items-center" delay={0.2}>
            <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-full overflow-hidden shadow-lg" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
              <Image
                src="images/logo.jpeg"
                alt="Balaji Holidays team"
                data-ai-hint="company logo"
                fill
                className="object-cover"
              />
            </div>
          </ScrollFadeIn>
        </div>

        <div className="mt-20">
          <ScrollFadeIn className="text-center">
            <h2 className="font-headline text-3xl font-semibold">Our Core Values</h2>
          </ScrollFadeIn>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollFadeIn className="text-center p-6">
              <div className="inline-block p-4 bg-primary/10 rounded-full">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h3 className="mt-6 font-headline text-xl font-semibold">Customer First</h3>
              <p className="mt-2 text-muted-foreground">
                Your satisfaction is our top priority. We listen, we care, and we deliver on our promises.
              </p>
            </ScrollFadeIn>
            <ScrollFadeIn className="text-center p-6" delay={0.2}>
              <div className="inline-block p-4 bg-primary/10 rounded-full">
                <Globe className="w-10 h-10 text-primary" />
              </div>
              <h3 className="mt-6 font-headline text-xl font-semibold">Authentic Experiences</h3>
              <p className="mt-2 text-muted-foreground">
                We strive to provide genuine cultural experiences that connect you with the heart of each destination.
              </p>
            </ScrollFadeIn>
            <ScrollFadeIn className="text-center p-6" delay={0.4}>
              <div className="inline-block p-4 bg-primary/10 rounded-full">
                <Lightbulb className="w-10 h-10 text-primary" />
              </div>
              <h3 className="mt-6 font-headline text-xl font-semibold">Continuous Innovation</h3>
              <p className="mt-2 text-muted-foreground">
                We are always exploring new destinations and travel styles to bring you fresh and exciting options.
              </p>
            </ScrollFadeIn>
          </div>
        </div>

      </div>
    </div>
  );
}
