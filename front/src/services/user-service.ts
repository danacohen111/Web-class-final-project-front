import { CredentialResponse } from "@react-oauth/google"

import apiClient from "./api-client";

export interface IUser {
  email: string;
  username?: string;
  password: string;
  imgUrl?: string;
  phoneNumber?: string;
  fullName?: string;
  _id?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const registerUser = (user: IUser) => {
  return new Promise<{ status: number; message: string }>((resolve, reject) => {
    apiClient
      .post("/auth/register", user)
      .then(async (response) => {
        const loginResponse = await loginUser({ password: user.password, email: user.email });
        resolve({ status: response.status, message: response.data.message });
      })
      .catch((error) => {
        reject({ status: error.response.status, message: error.response.data.message });
      });
  });
};

export const loginUser = (credentials: { password: string; email: string }) => {
  return new Promise<{ status: number; message: string; accessToken?: string; refreshToken?: string }>((resolve, reject) => {
    apiClient
      .post("/auth/login", credentials)
      .then((response) => {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        resolve({ status: response.status, message: response.data.message, accessToken, refreshToken });
      })
      .catch((error) => {
        reject({ status: error.response.status, message: error.response.data.message });
      });
  });
};

export const googleSignin = (credentialResponse: CredentialResponse) => {
  return new Promise<IUser>((resolve, reject) => {
      apiClient.post("/auth/google", credentialResponse).then((response) => {
          console.log(response)
          resolve(response.data)
      }).catch((error) => {
          console.log(error)
          reject(error)
      })
  })
};

export const getById = async (id: string) => {
  try {
    const response = await apiClient.get<IUser>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error; 
  }
};