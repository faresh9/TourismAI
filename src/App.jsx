// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Header, ContentInput, GeneratedContent } from './components';
import './styles/main.css';
import dotenv from 'dotenv';


function App() {
  // State to track the generated content
  const [generatedContent, setGeneratedContent] = useState('');
  const [placePhotos, setPlacePhotos] = useState({});


  

  useEffect(() => {
    // Initialize place photos state
    setPlacePhotos({});
  }, []);

  // Function to fetch place photos
  const fetchPlacePhotos = async (place) => {
    try {
      // Use your Google API key here
      const googleApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY;
      const corsProxy = 'https://corsproxy.io/?';

      // Fetch place details from Google Places API using the CORS proxy
      const detailsResponse = await fetch(
        `${corsProxy}https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos&key=${googleApiKey}`,
        {
          method: 'GET',
          headers: {
            'Origin': 'http://127.0.0.1:5173', // Replace with your actual origin
          },
        }
      );

      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        const photos = detailsData.result.photos || [];

        // Get the first photo reference (you can loop through photos for more)
        const photoReference = photos.length > 0 ? photos[0].photo_reference : '';

        // Fetch the actual photo using the reference
        if (photoReference) {
          const photoResponse = await fetch(
            `${corsProxy}https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${googleApiKey}`,
            {
              method: 'GET',
              headers: {
                'Origin': 'http://127.0.0.1:5173', // Replace with your actual origin
              },
            }
          );

          if (photoResponse.ok) {
            const blob = await photoResponse.blob();
            const imageUrl = URL.createObjectURL(blob);

            // Update place photos state with the image URL
            setPlacePhotos((prevPhotos) => ({
              ...prevPhotos,
              [place.place_id]: imageUrl,
            }));
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch place photos:', error);
    }
  };

  // Function to generate content using OpenAI API and include Google Places data
  const generateContent = async (destination, selectedPlace) => {
    try {
      // Use your Google API key here
      const googleApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY;
      const corsProxy = 'https://corsproxy.io/?';

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

        // Initialize place photos state
        setPlacePhotos({});

        // Fetch photos for each place
        for (const place of places) {
          fetchPlacePhotos(place);
        }

        // Construct a more informative AI prompt
        let prompt = `Generate a travel guide for ${selectedPlace} in ${destination}, including descriptions, recommendations, and photos.`;

        const apiKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY; // Replace with your OpenAI API key
        const response = await fetch('https://api.openai.com/v1/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-davinci-002',
            prompt,
            max_tokens: 600,
            temperature: 0.1,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedContent = data.choices[0].text;

          // Combine AI-generated content with Google Places data and photos
          const contentWithPlaces = (
            <div>
              <h2 className="text-xl font-semibold mb-4">Travel Guide for {selectedPlace} in {destination}</h2>
              <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Places:</h3>
                <ul>
                  {places.map((place, index) => (
                    <li key={index}>
                      <strong>{place.name}</strong><br />
                      {place.vicinity}<br />
                      Rating: {place.rating || 'N/A'}<br />
                      {placePhotos[place.place_id] && (
                        <img src={placePhotos[place.place_id]} alt={place.name} />
                      )}
                    </li>
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
