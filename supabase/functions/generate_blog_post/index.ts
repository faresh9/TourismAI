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

  // Construct the prompt for GPT to generate a blog post
  const prompt = `Convert the following itinerary into a blog post:\n\nItinerary:\nDestination: ${itinerary.destination}\nTravel Dates: ${itinerary.travel_dates}\nPreferences: ${itinerary.preferences}\nBudget: ${itinerary.budget}\n\nGenerate a blog post that includes a destination overview, day-by-day breakdown, travel tips, and affiliate links for hotels, flights, activities, travel insurance, and local tours. Include links like: Hotels: [insert hotel affiliate link], Flights: https://kiwi.tp.st/bGJUyY2B, Activities: [insert activity affiliate link], airport rides: [insert affiliate link], Tours: [insert tour affiliate link].`;

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