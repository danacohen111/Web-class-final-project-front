import axios from 'axios';
import { GEMINI_API_KEY } from '../config';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const GeminiService = {
  async analyzeDream(dream: string, realEstateData: any[]): Promise<string> {
    try {
      const prompt = `Given the user dream: "${dream}" and the following real estate data: ${JSON.stringify(
        realEstateData
      )}, return the best realestate according to the user's wishes and the reasons in a friendly paragraph as if you are a realestate agent`;

      const response = await axios.post(
        `${API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content || !response.data.candidates[0].content.parts || !response.data.candidates[0].content.parts[0]) {
        throw new Error("Unexpected response structure from Gemini API");
      }

      const text = response.data.candidates[0].content.parts[0].text;
      return text;
      
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      if (error.response && error.response.status === 429) {
        console.error("Rate limit exceeded. Please try again later.");
      } else if (error.response && error.response.status === 403) {
        console.error("Quota exceeded or insufficient permissions.");
      } else if (error.message) {
        console.error("Error Message:", error.message);
      }
      return "An error occurred while processing your request.";
    }
  },
};

export default GeminiService;