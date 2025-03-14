import apiClient from './api-client';
import { IRealEstate } from "../models/models";

export const createRealEstate = async (realEstateData: IRealEstate) => {
  try {
    const response = await apiClient.post<IRealEstate>('/realestate', realEstateData);
    return response.data;
  } catch (error) {
    console.error('Error creating real estate:', error);
    throw error;
  }
};

const RealEstateService = {
  async getAll(): Promise<IRealEstate[]> {
    try {
      const response = await apiClient.get<IRealEstate[]>('/realestate');
      return response.data;
    } catch (error) {
      console.error('Error fetching all real estate:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<IRealEstate> {
    try {
      const response = await apiClient.get<IRealEstate>(`/realestate/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching real estate with ID ${id}:`, error);
      throw error;
    }
  },
};

export default RealEstateService;