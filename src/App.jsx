// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Header, ContentInput, GeneratedContent } from './components';
import './styles/main.css';
import { fetchPlacePhotos } from './googlePlaces'; // Import Google Places function
import { generateContentWithOpenAI } from './openai'; // Import OpenAI function

function App() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [placePhotos, setPlacePhotos] = useState({});

  useEffect(() => {
    setPlacePhotos({});
  }, []);

  const generateContent = async (destination, selectedPlace) => {
    try {
      const googleApiKey = import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY;
      const placesResponse = await fetchPlacePhotos(selectedPlace, googleApiKey);
      const openaiApiKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY;

      const generatedContent = await generateContentWithOpenAI(
        destination,
        selectedPlace,
        openaiApiKey
      );

      setGeneratedContent(generatedContent);
    } catch (error) {
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
//done