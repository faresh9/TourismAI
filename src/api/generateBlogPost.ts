import { supabase } from '../supabaseClient';

export const generateBlogPost = async (itineraryId: string) => {
  const response = await fetch('/api/generate_blog_post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ itineraryId }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate blog post');
  }

  return response.json();
}; 