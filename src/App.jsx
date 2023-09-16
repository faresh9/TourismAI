//src/app.jsx
import React, { useState } from 'react';
import { Header, ContentInput, GeneratedContent, Footer } from './components';
import './styles/main.css';
import axios from 'axios'; // Import Axios

function App() {
  // State to track the generated content
  const [generatedContent, setGeneratedContent] = useState('');

  // Function to generate content using OpenAI API
  const generateContent = async (destination) => {
    try {
      // Replace 'YOUR_API_KEY' with your actual OpenAI API key
      const apiKey = 'YOUR_API_KEY';

      // Replace 'YOUR_ENGINE_ID' with the appropriate engine ID for text generation
      const engineId = 'YOUR_ENGINE_ID';

      // Set the text to be generated based on the destination
      const prompt = `Generate content for ${destination}`;

      const response = await axios.post(
        `https://api.openai.com/v1/engines/${engineId}/completions`,
        {
          prompt,
          max_tokens: 100, // Adjust the token limit as needed
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const generatedContent = response.data.choices[0].text;
        setGeneratedContent(generatedContent);
      } else {
        throw new Error('AI content generation failed');
      }
    } catch (error) {
      // Handle AI service error, e.g., display an error message to the user
      console.error(error);
    }
  };

  return (
    <div className="App">
      <Header />
      <ContentInput onGenerateContent={generateContent} />
      <GeneratedContent content={generatedContent} />
      <Footer />
    </div>
  );
}

export default App;
