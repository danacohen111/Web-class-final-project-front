import { CredentialResponse } from "@react-oauth/google";
import apiClient from "./api-client";
import { IUser } from "../models/models";
import axios from "axios";
import { config } from "../config.ts";

export const registerUser = (user: IUser) => {
  return new Promise<{ status: number; message: string }>((resolve, reject) => {
    axios
      .post<{ status: number; message: string }>(`${config.BASE_URL}/auth/register`, user)
      .then(async (response) => {
        await loginUser({ password: user.password!, email: user.email! });
        resolve({ status: response.status, message: response.data.message });
      })
      .catch((error) => {
        reject({ status: error.response.status, message: error.response.data.message });
      });
  });
};

export const loginUser = (credentials: { password: string; email: string }) => {
  return new Promise<{ status: number; message: string; accessToken?: string; refreshToken?: string }>((resolve, reject) => {
    axios
      .post<{ status: number; message: string; accessToken: string; refreshToken: string; _id: string }>(`${config.BASE_URL}/auth/login`, credentials)
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
  return new Promise<{ status: number; message: string; accessToken?: string; refreshToken?: string }>((resolve, reject) => {
    axios
      .post<{ status: number; message: string; accessToken: string; refreshToken: string; _id: string }>(`${config.BASE_URL}/auth/google`, credentialResponse)
      .then((response) => {
        const { accessToken, refreshToken, _id } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("id", _id);
        resolve({ status: response.status, message: response.data.message, accessToken, refreshToken });
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
    const payload: { username?: FormDataEntryValue | null; imgUrl?: FormDataEntryValue | null } = {};

    if (formData.has("username")) {
      payload.username = formData.get("username");
    }
    if (formData.has("image")) {
      payload.imgUrl = formData.get("image");
    }

    const response = await apiClient.put(`/users/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const logoutUser = () => {
  return new Promise<{ status: number; message: string }>((resolve, reject) => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      reject({ status: 400, message: "Refresh token is missing" });
      return;
    }

    axios
      .post<{ status: number; message: string }>(
        `${config.BASE_URL}/auth/logout`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        localStorage.clear();
        resolve({ status: response.status, message: response.data.message });
      })
      .catch((error) => {
        reject({ status: error.response.status, message: error.response.data.message });
      });
  });
};