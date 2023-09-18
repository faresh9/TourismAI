// src/App.jsx
import React, { useState } from 'react';
import { Header, ContentInput, GeneratedContent } from './components';
import './styles/main.css';

function App() {
  // State to track the generated content
  const [generatedContent, setGeneratedContent] = useState('');

  // Function to generate content using OpenAI API and include Unsplash images
  const generateContent = async (destination, selectedPlace) => {
    try {
      // Use your Google API key here
      const googleApiKey = 'AIzaSyA7YMzcxW-CYPbRbpVil28ZRnw6Dx4tCow';
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';

      // Fetch places from Google Places API using the CORS proxy
      const placesResponse = await fetch(
        `${corsProxy}https://maps.googleapis.com/maps/api/place/textsearch/json?query=${selectedPlace}+in+${destination}&key=${googleApiKey}`,
        {
          method: 'GET',
          headers: {
            'Origin': 'http://127.0.0.1:5173', // Replace with your actual origin
          },
        }
      );

      if (placesResponse.ok) {
        const placesData = await placesResponse.json();
        const places = placesData.results || [];

        console.log('Google Places:', places); // Add this line for debugging

        // Construct AI prompt and generate content
        let prompt = `Generate a list of ${selectedPlace} in ${destination}`;
        const apiKey = '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'; // Replace with your OpenAI API key
        const response = await fetch('https://api.openai.com/v1/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-davinci-002', // Use the appropriate model name
            prompt,
            max_tokens: 300, // Adjust the token limit as needed
            temperature: 0.1, // Experiment with different temperature settings
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedContent = data.choices[0].text;

          console.log('Generated Content:', generatedContent); // Add this line for debugging

          // Combine AI-generated content with Google Places data
          const contentWithPlaces = (
            <div>
              <h2 className="text-xl font-semibold mb-4">List of {selectedPlace} in {destination}</h2>
              <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Places:</h3>
                <ul>
                  {places.map((place, index) => (
                    <li key={index}>{place.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          );

          setGeneratedContent(contentWithPlaces);
        } else {
          throw new Error('AI content generation failed');
        }
      } else {
        throw new Error('Failed to fetch places from Google');
      }
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  return (
    <div className="App">
      <Header />
      <ContentInput onGenerateContent={generateContent} />
      <GeneratedContent content={generatedContent} />
    </div>
  );
}

export default App;
