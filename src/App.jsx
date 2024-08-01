import React, { useState } from 'react';
import { Header, ContentInput, GeneratedContent } from './components';
import './styles/main.css';
import { generateContentWithOpenAI } from './openai'; // Import OpenAI function

function App() {
  const [generatedContent, setGeneratedContent] = useState('');

  const generateContent = async (destination, selectedPlace) => {
    try {
      const openaiApiKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY;

      const generatedContent = await generateContentWithOpenAI(
        destination,
        selectedPlace,
        openaiApiKey
      );
      console.log('key');
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