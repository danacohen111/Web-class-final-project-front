import React, { useState } from 'react';
import RealEstateService from '../services/realestate-service';
import OpenAIService from '../services/openai-service';
import './../styles/AiRecommendations.css';

interface RealEstate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  location: string;
  _id: string;
}

const AiRecommendations: React.FC = () => {
  const [dream, setDream] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<RealEstate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      // 1. Fetch all real estate
      const allRealEstate = await RealEstateService.getAll();

      // 2. Send dream and real estate data to OpenAI
      const recommendedIds = await OpenAIService.analyzeDream(dream, allRealEstate);

      if (!recommendedIds || recommendedIds.length === 0) {
        setError('Could not get recommendations from AI.');
        setLoading(false);
        return;
      }

      // 3. Filter real estate based on recommended IDs
      const recommendedRealEstate = allRealEstate.filter((realEstate) =>
        recommendedIds.includes(realEstate._id)
      );

      setSearchResults(recommendedRealEstate);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-recommendations-container">
      <div className="header">
        <h1>SpotWise</h1>
        <p>Your Vision, The Perfect Location.</p>
      </div>
      <div className="content">
        <p>Please write up everything that comes to your mind to explain and describe your business idea so we can match the perfect location for your business</p>
        <div className="textarea-container">
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="Write here your dream as best as you can..."
          />
        </div>
        <button onClick={handleNext} disabled={loading}>
          {loading ? 'Loading...' : 'Next'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h2>Search Results</h2>
            <ul>
              {searchResults.map((result) => (
                <li key={result._id}>
                  {result.address}, {result.city} - {result.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiRecommendations;