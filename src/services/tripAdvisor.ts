import { API_CONFIG } from "../config/api";
import { Place } from "../types/types.ts";

const TRIPADVISOR_API_KEY = API_CONFIG.TRIPADVISOR_API_KEY;
const TRIPADVISOR_BASE_URL = API_CONFIG.TRIPADVISOR_BASE_URL;

if (!TRIPADVISOR_API_KEY) {
  throw new Error('TripAdvisor API key not configured');
}

// Function to search for places based on destination and category
export async function searchPlaces(destination: string): Promise<{ id: string; name: string }[]> {
  const response = await fetch(
    `${TRIPADVISOR_BASE_URL}/location/search?key=${TRIPADVISOR_API_KEY}&searchQuery=${encodeURIComponent(destination)}&language=en`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }
  );


  if (!response.ok) {
    throw new Error('Failed to fetch places from TripAdvisor');
  }

  const data = await response.json();
  console.log(data);
  return data.data.map((place: any) => ({
    id: place.location_id,
    name: place.name,
  }));
}

// Function to get detailed information about a specific place
export async function getPlaceDetails(placeId: string): Promise<Place> {
  const response = await fetch(
    `${TRIPADVISOR_BASE_URL}/location/${placeId}/details?key=${TRIPADVISOR_API_KEY}&language=en&currency=USD`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch details for place ${placeId}`);
  }

  const data = await response.json();
  
  // Convert rating to number and ensure it's valid
  const rating = typeof data.rating === 'string' ? parseFloat(data.rating) : data.rating;
  
  return {
    id: data.location_id,
    name: data.name,
    description: data.description || '',
    rating: typeof rating === 'number' && !isNaN(rating) ? rating : 0,
    photos: data.photo?.images?.large?.url ? [data.photo.images.large.url] : [],
    address: data.address_obj?.address_string || '',
    priceLevel: data.price_level || '',
    category: data.category?.name || '',
  };
}