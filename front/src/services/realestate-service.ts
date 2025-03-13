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

export const createRealEstate = async (realEstateData: IRealEstate) => {
  try {
    console.log("try realestating", realEstateData);
    const accessToken = localStorage.getItem("accessToken");
    const response = await apiClient.post('/realestate', realEstateData, {
      headers: {
        "Authorization": `JWT ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating real estate:', error);
    throw error;
  }
};

export default RealEstateService;