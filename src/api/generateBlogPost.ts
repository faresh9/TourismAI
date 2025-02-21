import { supabase } from '../supabaseClient';
//https://uhvustkoavmumkbtfoie.supabase.co/functions/v1/generate_blog_post
export const generateBlogPost = async (itineraryId: string) => {
  const response = await fetch('https://uhvustkoavmumkbtfoie.supabase.co/functions/v1/generate_blog_post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ itineraryId }),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Get the error text for debugging
    console.error('Error generating blog post:', errorText);
    throw new Error('Failed to generate blog post: ' + errorText);
  }

  return response.json();
}; 