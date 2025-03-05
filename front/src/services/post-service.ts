import apiClient from "./api-client";
import RealEstateService from "./realestate-service";
import { getById } from "./user-service";

export interface IUser {
  username?: string;
  imgUrl?: string;
}

export interface IRealEstate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  location: string;
  _id: string;
}

export interface IPost {
  _id: string;
  userId: string;
  user: IUser;
  realEstate: IRealEstate;
}

const PostService = {
  async getAll(): Promise<IPost[]> {
    const response = await apiClient.get<IPost[]>("/posts");
    const posts = response.data;

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const userResponse = await getById(post.userId); 
        const realEstateResponse = await RealEstateService.getById(post.realEstate._id); 
        return {
          ...post,
          user: userResponse,
          realEstate: realEstateResponse,
        };
      })
    );

    return postsWithDetails;
  },
};

export default PostService;
