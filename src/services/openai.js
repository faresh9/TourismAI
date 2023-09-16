const axios = require('axios');

const apiKey = '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'; // Replace with your OpenAI API key
const apiUrl = 'https://api.openai.com/v1/completions';

const generateContent = async (destination) => {
  try {
    const response = await axios.post(apiUrl, {
      model: 'text-davinci-002', // Use the appropriate model name
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

module.exports = generateContent;
