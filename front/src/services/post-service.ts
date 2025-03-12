import apiClient from "./api-client";
import RealEstateService from "./realestate-service";
import { getUserById } from "./user-service";

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
  sender: IUser;
  realEstate: IRealEstate;
}

const PostService = {
  async getAll(): Promise<IPost[]> {
    const response = await apiClient.get<IPost[]>("/posts");
    const posts = response.data;

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        try {
          const userResponse = await getUserById(post.userId); 
          const realEstateResponse = post.realEstate?._id
            ? await RealEstateService.getById(post.realEstate._id)
            : null;

          return {
            ...post,
            sender: userResponse, 
            realEstate: realEstateResponse || post.realEstate,
          };
        } catch (error) {
          console.error("Error fetching post details:", error);
          return post; 
        }
      })
    );

    return postsWithDetails;
  },
};

export default PostService;