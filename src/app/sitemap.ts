
import { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase'; // Path might need adjustment

type Package = {
  slug: string;
};

// This function needs to initialize a short-lived client to fetch data for the sitemap.
async function getFirebaseFirestore() {
  // A service account isn't available, so we use the client SDK initialization
  // This is not ideal for server-side generation but will work for this purpose.
  return new Promise<any>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Firebase initialization timeout'));
    }, 5000); // 5 second timeout
    
    try {
      const { firestore } = initializeFirebase();
      clearTimeout(timeout);
      resolve(firestore);
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balaji-holidays.com';

  // Static pages
  const staticRoutes = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Dynamic package pages
  const packageRoutes = await (async () => {
    try {
      const firestore = await getFirebaseFirestore();
      const packagesCollection = collection(firestore, 'holidayPackages');
      const packagesSnapshot = await getDocs(packagesCollection);
      const packagesList = packagesSnapshot.docs.map(doc => doc.data() as Package);

      return packagesList.map((pkg) => ({
        url: `${siteUrl}/packages/${pkg.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
    } catch (error) {
      console.error("Error fetching packages for sitemap:", error);
      return [];
    }
  })();
  
  return [...staticRoutes, ...packageRoutes];
}
