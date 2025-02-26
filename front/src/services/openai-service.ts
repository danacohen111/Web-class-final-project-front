// front/src/services/openai-service.ts
import axios from 'axios';
import { OPENAI_API_KEY } from '../config'; // Remove unnecessary imports

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'; // Correct API URL

const OpenAIService = {
  async analyzeDream(dream: string, realEstateData: any[]): Promise<string[]> {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo', // Correct model for chat completions
          messages: [
            {
              role: 'user',
              content: `Given the user dream: "${dream}" and the following real estate data: ${JSON.stringify(
                realEstateData
              )}, return the IDs of the most relevant real estate properties as a JSON array.`,
            },
          ],
          max_tokens: 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      let recommendedIds: string[] = [];
      try {
        const content = response.data.choices[0].message.content; // Correct response access
        recommendedIds = JSON.parse(content);
      } catch (e) {
        console.error('Error parsing AI response:', e);
        recommendedIds = [];
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return recommendedIds;
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
        console.error('Response Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }
      return [];
    }
  },
};

export default OpenAIService;