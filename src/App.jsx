import React, { useState } from 'react';
import { Header, ContentInput, GeneratedContent } from './components';
import './styles/main.css';

function App() {
  // State to track the generated content
  const [generatedContent, setGeneratedContent] = useState('');

  // Function to generate content using OpenAI API and include Unsplash images
  const generateContent = async (destination, selectedPlace) => {
    try {
      // Call Unsplash API to search for images
      const unsplashApiKey = 'wf6tsxbDVhM6-hQFm08M-kQg8iN-uqdK0wObXTMN2VY';
      const unsplashResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${selectedPlace} ${destination}`,
        {
          headers: {
            'Authorization': `Client-ID ${unsplashApiKey}`,
          },
        }
      );

      if (unsplashResponse.ok) {
        const unsplashData = await unsplashResponse.json();
        const photos = unsplashData.results || [];

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

          // Combine AI-generated content with Unsplash images
          const contentWithPictures = (
            <div>
              <h2>List of {selectedPlace} in {destination}</h2>
              <ul dangerouslySetInnerHTML={{ __html: generatedContent }} />
              {photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.urls.regular} // Use the image URL from Unsplash
                  alt="Place Image"
                />
              ))}
            </div>
          );

          setGeneratedContent(contentWithPictures);
        } else {
          throw new Error('AI content generation failed');
        }
      } else {
        throw new Error('Failed to fetch images from Unsplash');
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
