//import { serve } from 'https://deno.land/x/supabase@0.0.1/functions/mod.ts';
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai'; // Ensure you have OpenAI SDK installed

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

Deno.serve(async (req) => {
  const { itineraryId } = await req.json();

  // Fetch the itinerary from the database
  const { data: itinerary, error: fetchError } = await supabase
    .from('itineraries')
    .select('*')
    .eq('id', itineraryId)
    .single();

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 400 });
  }

  // Modified prompt with specific affiliate links
  const prompt = `Convert the following itinerary into a blog post:

Itinerary:
Destination: ${itinerary.destination}
Travel Dates: ${itinerary.travel_dates}
Preferences: ${itinerary.preferences}
Budget: ${itinerary.budget}

Generate a blog post that includes a destination overview, day-by-day breakdown, and travel tips. Include the following affiliate links naturally throughout the content:

- For hotel bookings: https://hotellook.tp.st/Q71axsc0
- For flight bookings: https://kiwi.tp.st/bGJUyY2B
- For activities and attractions: https://ticketnetwork.tp.st/rxKorwrw

Make sure to integrate these links naturally within the content, suggesting readers use them for booking their accommodations, flights, and activities. The blog post should be engaging and helpful while seamlessly incorporating these booking options.`;

  // Call OpenAI API to generate the blog post
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  const blogPostContent = response.choices[0].message.content;

  // Save the blog post to the database
  const { data: blogPost, error: blogPostError } = await supabase
    .from('generated_blog_posts')
    .insert([{ itinerary_id: itineraryId, content: blogPostContent, created_at: new Date() }]);

  if (blogPostError) {
    return new Response(JSON.stringify({ error: blogPostError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ blogPost: blogPostContent }), { status: 200 });
}); 