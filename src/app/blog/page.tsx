'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { BlogPost } from '@/components/admin/blog-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const { data: posts, loading } = useCollection<BlogPost>('blog');

  const sortedPosts = posts?.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Travel Stories & Insights</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Explore our collection of articles, tips, and travel guides from our team of experts.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-52 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          ))}

          {sortedPosts?.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className='p-0'>
                    <Link href={`/blog/${post.slug}`} className='block relative h-52 w-full'>
                        <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                    </Link>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                    <CardTitle className="font-headline text-2xl">
                         <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                     <CardDescription className='mt-2'>
                        By {post.author} on {formatDate(new Date(post.publishedDate))}
                    </CardDescription>
                    <p className="mt-4 text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className='p-6 pt-0'>
                    <Button asChild variant="outline">
                        <Link href={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-2" /></Link>
                    </Button>
                </CardFooter>
            </Card>
          ))}
        </div>
         {!loading && sortedPosts?.length === 0 && (
            <div className="text-center py-20 col-span-full">
                <h2 className="text-2xl font-semibold">No Blog Posts Yet</h2>
                <p className="text-muted-foreground mt-2">Check back soon for travel stories and tips!</p>
            </div>
        )}
      </div>
    </div>
  );
}
