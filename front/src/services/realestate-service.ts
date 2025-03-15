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

  async updateRealEstate(realEstateId: string, updatedData: Partial<IRealEstate>): Promise<IRealEstate> {
      try {
        console.log("Updating real estate with ID:", realEstateId);
        console.log("Updated data:", updatedData);
        const response = await apiClient.put<IRealEstate>(`/realestate/${realEstateId}`, updatedData);
        console.log("Updated real estate:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error updating real estate:", error);
        throw error;
      }
    },
};

export default RealEstateService;