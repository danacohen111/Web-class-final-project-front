import apiClient from './api-client';
import { IRealEstate } from "../models/models";

const RealEstateService = {
  async getAll(): Promise<IRealEstate[]> {
    try {
      const response = await apiClient.get<IRealEstate[]>("/realestate");
      return response.data;
    } catch (error) {
      console.error("Error fetching all real estate:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<IRealEstate | null> {
    return apiClient
      .get<IRealEstate>(`/realestate/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`Error fetching real estate with ID ${id}:`, error);
        return null;
      });
  },
};

export default RealEstateService;