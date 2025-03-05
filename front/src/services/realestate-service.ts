import apiClient from './api-client';

interface RealEstate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  location: string;
  _id: string;
}

const RealEstateService = {
  async getAll(): Promise<RealEstate[]> {
    const response = await apiClient.get<RealEstate[]>('/realestate');
    return response.data;
  },

  async getById(id: string): Promise<RealEstate> {
    try {
      const response = await apiClient.get<RealEstate>(`/realestate/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching real estate by ID:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

};

export default RealEstateService;