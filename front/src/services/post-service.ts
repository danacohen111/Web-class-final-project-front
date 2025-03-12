import apiClient from "./api-client";
import RealEstateService from "./realestate-service";
import { getUserById } from "./user-service";

export interface IUser {
  username?: string;
  imgUrl?: string;
  _id:string;
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
  user: string;
  realEstate: string;
}

const PostService = {
  async getAll(): Promise<IPost[]> {
    const response = await apiClient.get<IPost[]>("/posts");
    const posts = response.data;

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        try {
          const userResponse = post?.user ? await getUserById(post.user) : null;
          const realEstateResponse = post?.realEstate
            ? await RealEstateService.getById(post?.realEstate)
            : null;

          return {
            ...post,
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