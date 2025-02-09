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
    temperature: 0.1, // Reduced temperature further for faster, more consistent responses
    max_tokens: 50, // Reduced token limit since we only need a short array
    response_format: { type: 'json_object' }
  };

  try {
    const response = await llamaAPI.run(apiRequest);
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Invalid response format from Llama API');
    }

    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch (error) {
    console.error('Llama API Error:', error);
    return places.slice(0, 3).map(p => p.id); // Fallback to first 3 places if API fails
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
        content: 'Generate a concise travel guide in JSON format: {"highlights":["h1","h2"],"tips":["t1","t2"],"bestTimeToVisit":"season","customRecommendations":"text"}',
      },
      {
        role: 'user' as const,
        content: `Create brief guide for: ${places.map(p => p.name).join(', ')}`,
      }
    ],
    stream: false,
    temperature: 0.3,
    max_tokens: 200, // Reduced token limit for faster response
    response_format: { type: 'json_object' }
  };

  try {
    const response = await llamaAPI.run(apiRequest);
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return {
        highlights: [],
        tips: [],
        bestTimeToVisit: '',
        customRecommendations: ''
      };
    }

    const parsed = JSON.parse(content);
    return {
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
      bestTimeToVisit: typeof parsed.bestTimeToVisit === 'string' ? parsed.bestTimeToVisit : '',
      customRecommendations: typeof parsed.customRecommendations === 'string' ? parsed.customRecommendations : ''
    };
  } catch (error) {
    console.error('Travel Guide Generation Error:', error);
    throw new Error('Failed to generate travel guide');
  }
}