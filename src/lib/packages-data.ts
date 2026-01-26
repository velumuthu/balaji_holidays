export type ItineraryItem = {
  day: number;
  title: string;
  description: string;
};

export type Package = {
  id: string; // Firestore document ID
  name: string;
  slug: string;
  category: 'hill-stations' | 'pilgrimages' | 'historical' | 'honeymoon';
  duration: string;
  description: string;
  rating: number;
  image: string; // This can be a URL or an ID to a placeholder image
  gallery: string[];
  itinerary: ItineraryItem[];
  // No static data array
};

// Static data is removed and will be managed in Firestore.
export const packages: Package[] = [];
