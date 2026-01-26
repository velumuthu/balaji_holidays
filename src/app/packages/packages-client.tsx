
'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight } from 'lucide-react';
import { Package } from '@/lib/packages-data';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollFadeIn } from '@/components/scroll-fade-in';

const categories = [
    { name: 'All', value: 'all' },
    { name: 'Hill Stations', value: 'hill-stations' },
    { name: 'Pilgrimages', value: 'pilgrimages' },
    { name: 'Historical', value: 'historical' },
    { name: 'Honeymoon', value: 'honeymoon' },
];

export function PackagesClient() {
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get('category') || 'all';

    const { data: packages, loading } = useCollection<Package>('holidayPackages');

    const filteredPackages = activeCategory === 'all' 
        ? packages
        : packages?.filter(pkg => pkg.category === activeCategory);

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-16">
                <ScrollFadeIn className="text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Packages</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Discover a world of adventure with our expertly curated travel packages.
                    </p>
                </ScrollFadeIn>
                
                <ScrollFadeIn className="flex justify-center flex-wrap gap-2 mt-8">
                    {categories.map(category => (
                        <Button
                            key={category.value}
                            variant={activeCategory === category.value ? 'default' : 'outline'}
                            asChild
                        >
                            <Link href={`/packages?category=${category.value}`}>{category.name}</Link>
                        </Button>
                    ))}
                </ScrollFadeIn>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading && Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                    {filteredPackages?.map((pkg, index) => {
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
                {!loading && filteredPackages?.length === 0 && (
                    <ScrollFadeIn className="text-center py-20">
                        <h2 className="text-2xl font-semibold">No packages found</h2>
                        <p className="text-muted-foreground mt-2">Try selecting a different category.</p>
                    </ScrollFadeIn>
                )}
            </div>
        </div>
    );
}
