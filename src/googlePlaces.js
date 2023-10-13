// googlePlaces.js
import axios from 'axios';

// Function to fetch place photos
export const fetchPlacePhotos = async (place, googleApiKey) => {
  try {
    const corsProxy = 'https://corsproxy.io/?';

    // Fetch place details from Google Places API using the CORS proxy
    const detailsResponse = await fetch(
      `${corsProxy}https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos&key=${googleApiKey}`,
      {
        method: 'GET',
        headers: {
          'Origin': 'http://127.0.0.1:5173', // Replace with your actual origin
        },
      }
    );

    if (detailsResponse.ok) {
      const detailsData = await detailsResponse.json();
      const photos = detailsData.result.photos || [];

      // Get the first photo reference (you can loop through photos for more)
      const photoReference = photos.length > 0 ? photos[0].photo_reference : '';

      // Fetch the actual photo using the reference
      if (photoReference) {
        const photoResponse = await fetch(
          `${corsProxy}https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${googleApiKey}`,
          {
            method: 'GET',
            headers: {
              'Origin': 'http://127.0.0.1:5173', // Replace with your actual origin
            },
          }
        );

        if (photoResponse.ok) {
          const blob = await photoResponse.blob();
          const imageUrl = URL.createObjectURL(blob);

          return imageUrl;
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch place photos:', error);
  }
};
