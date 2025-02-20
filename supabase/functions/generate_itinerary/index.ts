// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
//import { serve } from 'https://deno.land/x/supabase@0.0.1/functions/mod.ts';
import { createClient } from "jsr:@supabase/supabase-js@2";
import { OpenAI } from 'openai'; // Ensure you have OpenAI SDK installed
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts"; // Import SMTPClient from denomailer

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const gmailAppPassword = Deno.env.get('GMAIL_APP_PASSWORD'); // Access the Gmail app password

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

Deno.serve(async (req) => {
  try {
    const { destination, travelDates, preferences, budget, email } = await req.json();

    // Construct the prompt for GPT
    const prompt = `Generate a travel itinerary for ${destination} from ${travelDates.start} to ${travelDates.end}. 
    Preferences: ${preferences}. Budget: ${budget}. Include local attractions, cultural experiences, restaurant recommendations, and transportation options.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const itinerary = response.choices[0].message.content;

    // Save itinerary to the database
    const { data, error } = await supabase
      .from('itineraries')
      .insert([{ destination, travel_dates: travelDates, preferences, budget, created_at: new Date() }]);

    if (error) {
      console.error('Error saving itinerary:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    // Set up SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: 'fares.haroun33@gmail.com',
          password: gmailAppPassword,
        },
      },
    });

    // Send email with the itinerary
    await client.send({
      from: 'fares.haroun33@gmail.com',
      to: email,
      subject: `Your Itinerary for ${destination}`,
      content: `Hello! Here is your itinerary:\n\n${itinerary}`,
      html: `<p>Hello!</p><p>Here is your itinerary:</p><p>${itinerary}</p>`,
    });

    await client.close();

    // After saving the itinerary, call the blog post generation function
    const blogPostResponse = await supabase
      .rpc('generate_blog_post', { itineraryId: data[0].id });

    if (blogPostResponse.error) {
      console.error('Error generating blog post:', blogPostResponse.error);
      return new Response(JSON.stringify({ error: blogPostResponse.error.message }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ itinerary }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate_itinerary' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
