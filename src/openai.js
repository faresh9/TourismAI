export const generateContentWithOpenAI = async (destination, selectedPlace, apiKey) => {
  try {
    // Construct a more informative AI prompt
    const prompt = `Generate a travel guide for ${selectedPlace} in ${destination}, including descriptions, recommendations, and photos.`;

    console.log('Prompt:', prompt);

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600,
          temperature: 0.7,
        }),
      }
    );

    console.log('Response status:', response.status);

    if (response.status === 200) {
      const data = await response.json();
      console.log('Response data:', data);
      const generatedContent = data.choices[0].message.content;
      return generatedContent;
    } else {
      const errorData = await response.json();
      console.error('Error data:', errorData);
      throw new Error(`AI content generation failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};