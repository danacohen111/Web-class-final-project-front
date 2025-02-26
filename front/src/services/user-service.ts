import apiClient from "./api-client";

export interface IUser {
  email: string;
  username: string;
  password?: string;
  imgUrl?: string; // TO DO: add imgUrl to the user model
  _id?: string;
  accessToken?: string;
  refreshToken?: string;
}

export const registerUser = (user: IUser) => {
  return new Promise<{ status: number; message: string }>((resolve, reject) => {
    console.log("Registering user...");
    console.log(user);
    apiClient
      .post("/auth/register", user)
      .then((response) => {
        console.log(response);
        resolve({ status: response.status, message: response.data.message });
      })
      .catch((error) => {
        console.log(error);
        reject({ status: error.response.status, message: error.response.data.message });
      });
  });
};