import { CredentialResponse } from "@react-oauth/google";
import apiClient from "./api-client";
import { IUser } from "../models/models"

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
        const { accessToken, refreshToken, _id } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("id", _id);
        resolve({ status: response.status, message: response.data.message, accessToken, refreshToken });
      })
      .catch((error) => {
        reject({ status: error.response.status, message: error.response.data.message });
      });
  });
};

export const googleSignin = (credentialResponse: CredentialResponse) => {
  return new Promise<IUser>((resolve, reject) => {
    apiClient
      .post("/auth/google", credentialResponse)
      .then((response) => {
        const { accessToken, refreshToken, _id } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("id", _id);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const getUserById = async (id?: string): Promise<IUser> => {
  const userId = id || localStorage.getItem("id");
  if (!userId) throw new Error("User ID is missing");
  const response = await apiClient.get<IUser>(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (formData: FormData) => {
  try {
    const userId = localStorage.getItem("id");
    const accessToken = localStorage.getItem("accessToken");
    const payload: any = {};

    if (formData.has("username")) {
      payload.username = formData.get("username");
    }
    if (formData.has("image")) {
      payload.imgUrl = formData.get("image");
    }

    const response = await apiClient.put(`/users/${userId}`, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${accessToken}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};