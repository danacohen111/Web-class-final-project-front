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
    try {
      const response = await apiClient.get<RealEstate[]>("/realestate");
      return response.data;
    } catch (error) {
      console.error("Error fetching all real estate:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<RealEstate | null> {
    return apiClient
      .get<RealEstate>(`/realestate/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`Error fetching real estate with ID ${id}:`, error);
        return null;
      });
  },
};

export default RealEstateService;