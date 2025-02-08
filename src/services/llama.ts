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
        content: 'You are a travel expert. Return ONLY a JSON array of place IDs without any explanation or additional text. Example: ["123", "456", "789"]',
      },
      {
        role: 'user' as const,
        content: `From these places: ${JSON.stringify(places)}, select the best 3 and return ONLY their IDs in a JSON array.`,
      },
    ],
    stream: false,
    temperature: 0.3, // Reduced temperature for more deterministic output
    max_tokens: 100,
    response_format: { type: 'json_object' } // Specify JSON object format
  };

  try {
    const response = await llamaAPI.run(apiRequest);
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Invalid response format from Llama API');
    }

    // Parse the content and extract the IDs array
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error('Expected JSON array response from Llama API');
    }

    return parsed;
  } catch (error) {
    console.error('Llama API Error:', error);
    // Return empty array as fallback
    return [];
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
        content: 'You are a travel expert. Return ONLY a JSON object with this exact structure: {"highlights":[],"tips":[],"bestTimeToVisit":"","customRecommendations":""}',
      },
      {
        role: 'user' as const,
        content: `Create a travel guide for: ${JSON.stringify(places.map(p => p.name))}`,
      },
    ],
    stream: false,
    temperature: 0.5,
    max_tokens: 1000,
    response_format: { type: 'json_object' }
  };

  try {
    const response = await llamaAPI.run(apiRequest);
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Invalid response format from Llama API');
    }

    const guide = JSON.parse(content) as TravelGuide;
    return {
      highlights: guide.highlights || [],
      tips: guide.tips || [],
      bestTimeToVisit: guide.bestTimeToVisit || '',
      customRecommendations: guide.customRecommendations || ''
    };
  } catch (error) {
    console.error('Travel Guide Generation Error:', error);
    throw new Error('Failed to generate travel guide');
  }
}