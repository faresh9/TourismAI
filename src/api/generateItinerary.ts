import { supabase } from '../supabaseClient';

export const generateItinerary = async (data: {
  destination: string;
  travelDates: { start: string; end: string };
  preferences: string;
  budget: string;
  email: string;
}) => {
  try {
    const response = await fetch('https://uhvustkoavmumkbtfoie.supabase.co/functions/v1/generate_itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to generate itinerary: ' + errorText);
    }

    return response.json();
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
}; 