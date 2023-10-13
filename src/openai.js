// openai.js
import axios from 'axios';

// Function to generate content using OpenAI API
export const generateContentWithOpenAI = async (destination, selectedPlace, apiKey) => {
  try {
    // Construct a more informative AI prompt
    let prompt = `Generate a travel guide for ${selectedPlace} in ${destination}, including descriptions, recommendations, and photos.`;

    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-002',
        prompt,
        max_tokens: 600,
        temperature: 0.1,
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
      return generatedContent;
    } else {
      throw new Error('AI content generation failed');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
