// front/src/services/openai-service.ts
import axios from 'axios';
import { OPENAI_API_KEY } from '../config';

const OPENAI_API_URL = 'https://api.openai.com/v1/completions';

const OpenAIService = {
  async analyzeDream(dream: string, realEstateData: any[]): Promise<string[]> {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'text-davinci-003',
          prompt: `Given the user dream: "${dream}" and the following real estate data: ${JSON.stringify(
            realEstateData
          )}, return the IDs of the most relevant real estate properties as a JSON array.`,
          max_tokens: 100, // Adjust as needed
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
        const jsonString = response.data.choices[0].text.trim();
        recommendedIds = JSON.parse(jsonString);
      } catch (e) {
        console.error('Error parsing AI response:', e);
        recommendedIds = [];
      }

      // Add a delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return recommendedIds;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return [];
    }
  },
};

export default OpenAIService;