// src/services/openai.js
const axios = require('axios');

const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

const generateContent = async (destination) => {
  try {
    const response = await axios.post(apiUrl, {
      prompt: `Generate content for ${destination}`,
      max_tokens: 100, // Adjust the token limit as needed
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      return response.data.choices[0].text;
    } else {
      throw new Error('AI content generation failed');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default generateContent;
