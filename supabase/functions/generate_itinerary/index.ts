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
//const gmailAppPassword = Deno.env.get('GMAIL_APP_PASSWORD'); // Access the Gmail app password

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins or specify your frontend URL
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const { destination, travelDates, preferences, budget, email } = await req.json();

    // Construct the prompt for GPT
    const prompt = `Generate a travel itinerary for ${destination} from ${travelDates.start} to ${travelDates.end}. 
    Preferences: ${preferences}. Budget: ${budget}. Include local attractions, cultural experiences, restaurant recommendations, and transportation options. 
    Please format the itinerary in a way that is easy to style with HTML and CSS.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const itinerary = response.choices[0].message.content;
    console.log('Generated Itinerary:', itinerary);
    // Save itinerary to the database and return the inserted row
    const { data, error } = await supabase
      .from('itineraries')
      .insert([{
        destination,
        travel_dates: {
          start: travelDates.start,
          end: travelDates.end
        },
        preferences,
        budget,
        created_at: new Date()
      }])
      .select(); // This ensures that the inserted data is returned

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

    // Check if data is valid and has at least one entry
    if (!data || data.length === 0) {
      console.error('No data returned from itinerary insertion');
      return new Response(JSON.stringify({ error: 'Failed to retrieve itinerary ID' }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    // Access the ID of the newly created itinerary
    const itineraryId = data[0].id; // This should now work correctly

    // Set up SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: 'fares.haroun33@gmail.com',
          password: "fdfy vqxo zwha ubsm",
        },
      },
    });

    // Send email with the styled itinerary
    await client.send({
      from: 'fares.haroun33@gmail.com',
      to: email,
      subject: `Your Itinerary for ${destination}`,
      content: `Hello! Here is your itinerary:\n\n${itinerary}`,
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
              }
              .container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #333;
              }
              p {
                color: #555;
              }
              .itinerary {
                margin-top: 20px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #fafafa;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Hello!</h1>
              <p>Here is your itinerary:</p>
              <div class="itinerary">${itinerary}</div>
            </div>
          </body>
        </html>
      `,
    });

    await client.close();

    // After saving the itinerary, call the blog post generation function
    const blogPostResponse = await fetch('https://uhvustkoavmumkbtfoie.supabase.co/functions/v1/generate_blog_post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itineraryId: itineraryId }),
    });

    // Check the response from the blog post generation function
    if (!blogPostResponse.ok) {
      const errorText = await blogPostResponse.text();
      console.error('Error generating blog post:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate blog post: ' + errorText }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    // Parse the response
    const blogPostData = await blogPostResponse.json();

    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*', // Allow all origins or specify your frontend URL
      'Content-Type': 'application/json',
    };

    // Return response with CORS headers
    return new Response(JSON.stringify({ itinerary, blogPost: blogPostData }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins or specify your frontend URL
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
