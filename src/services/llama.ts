import LlamaAI from 'llamaai';
import { API_CONFIG } from '../config/api';
import type { Place, TravelGuide } from '../types/types.ts';

const llamaAPI = new LlamaAI(API_CONFIG.LLAMA_API_KEY);

export async function selectBestPlaces(places: { id: string; name: string }[]): Promise<string[]> {
  if (!API_CONFIG.LLAMA_API_KEY) {
    throw new Error('Llama API key not configured');
  }

  const apiRequest = {
    messages: [
      {
        role: 'system' as const,
        content: 'You are a travel expert helping select the best places to visit.',
      },
      {
        role: 'user' as const,
        content: `Given these places: ${JSON.stringify(places)}, select the best 3 places and return their IDs as a JSON array.`,
      },
    ],
    stream: false,
    temperature: 0.7,
    max_tokens: 100,
    response_format: { type: 'json' }
  };

  try {
    const response = await llamaAPI.run(apiRequest);
    return JSON.parse(response.choices[0].message.content);
  } catch {
    throw new Error('Failed to get recommendations from Llama');
  }
}

export async function generateTravelGuide(places: Place[]): Promise<TravelGuide> {
  if (!API_CONFIG.LLAMA_API_KEY) {
    throw new Error('Llama API key not configured');
  }

  const apiRequest = {
    messages: [
      {
        role: 'system' as const,
        content: 'You are a travel expert creating personalized travel guides. Always return responses in JSON format with the following structure: { highlights: string[], tips: string[], bestTimeToVisit: string, customRecommendations: string }',
      },
      {
        role: 'user' as const,
        content: `Create a travel guide for these places: ${JSON.stringify(places)}. Include highlights, tips, best time to visit, and custom recommendations.`,
      },
    ],
    stream: false,
    temperature: 0.8,
    max_tokens: 1000,
    response_format: { type: 'json' }
  };

  try {
    const response = await llamaAPI.run(apiRequest);
    return JSON.parse(response.choices[0].message.content);
  } catch {
    throw new Error('Failed to generate travel guide');
  }
}