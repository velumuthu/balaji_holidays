

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Star, Clock, Mountain, ShipWheel, Landmark, Heart } from 'lucide-react';
import { PackageDetailClient } from './package-detail-client';
import { Package } from '@/lib/packages-data';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const categoryIcons = {
    'hill-stations': Mountain,
    'pilgrimages': ShipWheel,
    'historical': Landmark,
    'honeymoon': Heart,
};

async function getPackage(slug: string): Promise<Package | null> {
    const { firestore } = initializeFirebase();
    const packagesCollection = collection(firestore, 'holidayPackages');
    const q = query(packagesCollection, where('slug', '==', slug), limit(1));
    const packagesSnapshot = await getDocs(q);

    if (packagesSnapshot.empty) {
        return null;
    }
    const doc = packagesSnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Package;
}

export default async function PackageDetailPage({ params }: { params: { slug: string } }) {
    const pkg = await getPackage(params.slug);

    if (!pkg) {
        notFound();
    }

    const CategoryIcon = categoryIcons[pkg.category];

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">{pkg.name}</h1>
                    <div className="flex items-center flex-wrap gap-x-6 gap-y-2 mt-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{pkg.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           {CategoryIcon && <CategoryIcon className="w-5 h-5" />}
                            <span className='capitalize'>{pkg.category.replace('-', ' ')}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < pkg.rating ? 'text-primary fill-current' : 'text-muted'}`} />
                            ))}
                            <span>({pkg.rating}.0)</span>
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    <div className="relative h-64 sm:h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={pkg.image}
                            alt={pkg.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {pkg.gallery.slice(0, 4).map((imgPath, index) => (
                            <div key={index} className="relative h-full rounded-lg overflow-hidden shadow-md min-h-[120px] md:min-h-0">
                                <Image
                                    src={imgPath}
                                    alt={`${pkg.name} gallery image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <h2 className="font-headline text-3xl font-semibold mb-4">About this tour</h2>
                        <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: pkg.description.replace(/\n/g, '<br />') }} />
                        
                        <h2 className="font-headline text-3xl font-semibold mt-8 mb-4">Itinerary</h2>
                        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                            {pkg.itinerary.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-lg font-semibold text-left">
                                        Day {item.day}: {item.title}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground prose">
                                        {item.description}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        {pkg.virtualTourUrl && (
                             <div className="mt-8">
                                <h2 className="font-headline text-3xl font-semibold mb-4">Virtual Tour</h2>
                                <div className="aspect-video">
                                     <iframe 
                                        className="w-full h-full rounded-lg shadow-xl"
                                        src={pkg.virtualTourUrl}
                                        title={`${pkg.name} Virtual Tour`} 
                                        allowFullScreen
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade">
                                    </iframe>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                       <PackageDetailClient packageName={pkg.name} />
                    </div>
                </div>
            </div>
        </div>
    );
}
