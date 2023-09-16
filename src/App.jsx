import React, { useState } from 'react';
import { Header, ContentInput, GeneratedContent, Footer } from './components';
import './styles/main.css';

function App() {
  // State to track the generated content
  const [generatedContent, setGeneratedContent] = useState('');

  // Function to generate content using OpenAI API
  const generateContent = async (destination) => {
    try {
      // Replace 'YOUR_API_KEY' with your actual OpenAI API key
      const apiKey = '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';

      // Set the text to be generated based on the destination
      const prompt = `Generate content for ${destination}`;

      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-davinci-002', // Use the appropriate model name
          prompt,
          max_tokens: 100, // Adjust the token limit as needed
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedContent = data.choices[0].text;
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
